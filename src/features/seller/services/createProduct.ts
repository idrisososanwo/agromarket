import { createClient } from '@/lib/supabase/client'
import { ProductFormValues } from '../schemas'
import { SellerProduct } from '../types'

export async function createProduct(values: ProductFormValues, sellerId: string): Promise<SellerProduct> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      ...values,
      seller_id: sellerId,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as SellerProduct
}
