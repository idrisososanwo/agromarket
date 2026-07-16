import { createClient } from '@/lib/supabase/client'
import { CartItem } from '@/features/buyer/types'

export async function validateCheckout(cartItems: CartItem[]): Promise<void> {
  const supabase = createClient()
  
  if (cartItems.length === 0) {
    throw new Error('Your shopping cart is empty.')
  }

  for (const item of cartItems) {
    const { data: product, error } = await supabase
      .from('products')
      .select('quantity, title, status')
      .eq('id', item.product_id)
      .single()

    if (error || !product) {
      throw new Error(`Product "${item.products?.title || 'Unknown'}" no longer exists in our catalog.`)
    }

    if (product.status !== 'active') {
      throw new Error(`Product "${product.title}" is no longer active for purchase.`)
    }

    if (Number(item.quantity) > Number(product.quantity)) {
      throw new Error(`Insufficient stock for "${product.title}". Only ${product.quantity} units are available, but you requested ${item.quantity}.`)
    }
  }
}
