import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '@/features/marketplace/types'

export async function saveRecentlyViewed(productId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Upsert the viewed timestamp
  await supabase
    .from('recently_viewed')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id' }
    )

  // Cap at 10 items
  const { data: history } = await supabase
    .from('recently_viewed')
    .select('id')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })

  if (history && history.length > 10) {
    const idsToDelete = history.slice(10).map((h) => h.id)
    await supabase.from('recently_viewed').delete().in('id', idsToDelete)
  }
}

export async function getRecentlyViewed(): Promise<ProductWithSeller[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('recently_viewed')
    .select('*, products(*, profiles(full_name, avatar_url))')
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })
    .limit(10)

  if (error) throw error
  if (!data) return []

  // Map and filter out any deleted products
  return data
    .filter((d) => d.products && !d.products.is_removed)
    .map((d) => d.products) as ProductWithSeller[]
}
