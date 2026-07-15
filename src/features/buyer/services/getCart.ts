import { createClient } from '@/lib/supabase/client'
import { CartItem } from '../types'

export async function getCart(buyerId: string): Promise<CartItem[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products:product_id(title, price, unit, image_url, quantity)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as CartItem[]) || []
}
