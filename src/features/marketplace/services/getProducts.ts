import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '../types'

interface GetProductsOptions {
  category?: string
}

export async function getProducts({ category }: GetProductsOptions = {}): Promise<ProductWithSeller[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .order('created_at', { ascending: false })

  if (category && category !== 'All') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as ProductWithSeller[]) || []
}
