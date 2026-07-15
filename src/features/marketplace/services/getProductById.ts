import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '../types'

export async function getProductById(id: string): Promise<ProductWithSeller> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error('Product not found')
  }

  return data as unknown as ProductWithSeller
}
