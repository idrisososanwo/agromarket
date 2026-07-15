import { createClient } from '@/lib/supabase/client'

export async function addToCart(buyerId: string, productId: string, incrementalQty: number): Promise<void> {
  const supabase = createClient()

  // 1. Check if product already exists in buyer's cart
  const { data: existing, error: fetchError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .maybeSingle()

  if (fetchError) {
    throw new Error(fetchError.message)
  }

  // 2. Fetch the product to verify stock limits
  const { data: product, error: prodError } = await supabase
    .from('products')
    .select('quantity, title')
    .eq('id', productId)
    .single()

  if (prodError) {
    throw new Error(prodError.message)
  }

  const currentQty = existing ? Number(existing.quantity) : 0
  const targetQty = currentQty + incrementalQty

  if (targetQty > Number(product.quantity)) {
    throw new Error(`Cannot add to cart. Only ${product.quantity} units of "${product.title}" are available in stock.`)
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: targetQty, updated_at: new Date().toISOString() })
      .eq('id', existing.id)

    if (updateError) {
      throw new Error(updateError.message)
    }
  } else {
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        buyer_id: buyerId,
        product_id: productId,
        quantity: targetQty,
      })

    if (insertError) {
      throw new Error(insertError.message)
    }
  }
}
