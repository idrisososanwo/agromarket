import { createClient } from '@/lib/supabase/client'
import { SellerOrder } from '../types'

export async function getSellerOrders(sellerId: string): Promise<SellerOrder[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles:buyer_id(full_name, avatar_url), products:product_id(title, image_url)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as SellerOrder[]) || []
}
