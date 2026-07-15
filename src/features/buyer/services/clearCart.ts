import { createClient } from '@/lib/supabase/client'

export async function clearCart(buyerId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('buyer_id', buyerId)

  if (error) {
    throw new Error(error.message)
  }
}
