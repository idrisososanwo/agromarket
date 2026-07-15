import { createClient } from '@/lib/supabase/client'

export async function removeCartItem(cartItemId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)

  if (error) {
    throw new Error(error.message)
  }
}
