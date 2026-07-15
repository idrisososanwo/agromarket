import { createClient } from '@/lib/supabase/client'
import { ProductFormValues } from '../schemas'
import { SellerProduct } from '../types'

export async function updateProduct(id: string, values: ProductFormValues, sellerId: string): Promise<SellerProduct> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .update(values)
    .eq('id', id)
    .eq('seller_id', sellerId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as SellerProduct
}
