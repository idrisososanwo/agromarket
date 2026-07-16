import { createClient } from '@/lib/supabase/client'
import { CartItem } from '@/features/buyer/types'
import { CheckoutDeliveryInfo } from '../types'
import { calculateOrderTotals } from './calculateOrderTotals'
import { validateCheckout } from './validateCheckout'

export async function createOrder(
  buyerId: string,
  cartItems: CartItem[],
  deliveryInfo: CheckoutDeliveryInfo
): Promise<string> {
  const supabase = createClient()

  // 1. Double check and validate stock before making edits
  await validateCheckout(cartItems)

  const { subtotal, deliveryFee, total } = calculateOrderTotals(cartItems)

  // 2. Create the parent Order record
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      buyer_id: buyerId,
      subtotal,
      delivery_fee: deliveryFee,
      total_amount: total,
      payment_status: 'pending',
      order_status: 'awaiting_payment',
      delivery_name: deliveryInfo.delivery_name,
      delivery_phone: deliveryInfo.delivery_phone,
      delivery_address: deliveryInfo.delivery_address,
      notes: deliveryInfo.notes || null,
    })
    .select('id')
    .single()

  if (orderError || !newOrder) {
    throw new Error(orderError?.message || 'Failed to create order.')
  }

  const orderId = newOrder.id

  try {
    // 3. Create the Order Items and decrement stock
    for (const item of cartItems) {
      const { data: product, error: pError } = await supabase
        .from('products')
        .select('seller_id, price, quantity')
        .eq('id', item.product_id)
        .single()

      if (pError || !product) {
        throw new Error(pError?.message || 'Product details missing')
      }

      const unitPrice = Number(product.price)
      const totalPrice = unitPrice * item.quantity

      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: item.product_id,
          seller_id: product.seller_id,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          status: 'pending',
        })

      if (itemError) {
        throw new Error(itemError.message)
      }

      // 4. Update the remaining stock of the product
      const newStock = Number(product.quantity) - Number(item.quantity)
      const { error: stockError } = await supabase
        .from('products')
        .update({ quantity: newStock })
        .eq('id', item.product_id)

      if (stockError) {
        throw new Error(stockError.message)
      }
    }

    // 5. Clear the buyer's cart
    const { error: cartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('buyer_id', buyerId)

    if (cartError) {
      throw new Error(cartError.message)
    }

    return orderId
  } catch (error: any) {
    // Clean up order to keep database consistent
    await supabase.from('orders').delete().eq('id', orderId)
    throw new Error(error.message || 'Order creation failed.')
  }
}
