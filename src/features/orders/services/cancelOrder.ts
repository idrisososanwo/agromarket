import { createClient } from '@/lib/supabase/client'

export async function cancelOrder(
  orderId: string,
  buyerId: string,
  reason: string
): Promise<void> {
  const supabase = createClient()

  // 1. Load items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  // 2. Increment stock levels back to active inventory
  if (items && items.length > 0) {
    for (const item of items) {
      if (item.product_id) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single()

        if (product) {
          const newStock = product.stock + item.quantity
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id)
        }
      }
    }
  }

  // 3. Mark as cancelled
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      order_status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancelled_reason: reason,
      updated_by: buyerId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (updateError) {
    throw new Error(updateError.message)
  }
}
