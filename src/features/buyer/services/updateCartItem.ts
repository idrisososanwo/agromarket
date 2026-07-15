import { createClient } from '@/lib/supabase/client'

export async function updateCartItem(cartItemId: string, quantity: number): Promise<void> {
  if (quantity < 1) {
    throw new Error('Quantity must be at least 1')
  }

  const supabase = createClient()

  // 1. Fetch item detail to check stock limit
  const { data: cartItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('product_id, products(quantity, title)')
    .eq('id', cartItemId)
    .single()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  const stockLimit = Number((cartItem as any).products?.quantity || 0)
  const productTitle = (cartItem as any).products?.title || 'Product'

  if (quantity > stockLimit) {
    throw new Error(`Cannot update quantity. Only ${stockLimit} units of "${productTitle}" are available.`)
  }

  // 2. Update in Supabase
  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', cartItemId)

  if (updateError) {
    throw new Error(updateError.message)
  }
}
