import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '@/features/marketplace/types'

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit: number = 4
): Promise<ProductWithSeller[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_removed', false)
    .eq('status', 'active')
    .eq('category', category)
    .neq('id', productId) // exclude current product
    .limit(limit)

  if (error) throw error
  return (data ?? []) as ProductWithSeller[]
}
