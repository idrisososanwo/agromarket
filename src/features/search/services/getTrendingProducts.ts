import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '@/features/marketplace/types'

export async function getTrendingProducts(limit: number = 10): Promise<ProductWithSeller[]> {
  const supabase = createClient()

  // In production, this can query a `trending_analytics` table or sum checkout items from the last 7 days.
  // For now, we fetch high-value active products sorted by recent creation
  const { data, error } = await supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_removed', false)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as ProductWithSeller[]
}
