import { createClient } from '@/lib/supabase/client'
import { SellerProduct } from '../types'

export async function getSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data as SellerProduct[]) || []
}
