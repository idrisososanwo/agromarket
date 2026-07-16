import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller } from '@/features/marketplace/types'

export async function getRecommendations(limit: number = 8): Promise<{
  recommendedForYou: ProductWithSeller[]
  topRated: ProductWithSeller[]
  trendingThisWeek: ProductWithSeller[]
}> {
  const supabase = createClient()

  // 1. Get current user's profile/preferences to personalize
  const { data: { user } } = await supabase.auth.getUser()
  
  // 2. Fetch Top Rated products (fallback to general list ordered by title or price range)
  const { data: topRatedData } = await supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_removed', false)
    .eq('status', 'active')
    .limit(limit)

  // 3. Fetch Trending (ordered by date or stock levels)
  const { data: trendingData } = await supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_removed', false)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(limit)

  // 4. Personalization logic for "Recommended For You"
  let recommendedData = trendingData ?? []
  if (user) {
    // Look up user's recent search terms or categories to filter products
    const { data: history } = await supabase
      .from('search_history')
      .select('search_term')
      .eq('user_id', user.id)
      .limit(3)

    if (history && history.length > 0) {
      const terms = history.map((h) => `%${h.search_term}%`)
      const { data: personalized } = await supabase
        .from('products')
        .select('*, profiles(full_name, avatar_url)')
        .eq('is_removed', false)
        .eq('status', 'active')
        .or(terms.map((t) => `title.ilike.${t}`).join(','))
        .limit(limit)

      if (personalized && personalized.length > 0) {
        recommendedData = personalized
      }
    }
  }

  return {
    recommendedForYou: (recommendedData ?? []) as ProductWithSeller[],
    topRated: (topRatedData ?? []) as ProductWithSeller[],
    trendingThisWeek: (trendingData ?? []) as ProductWithSeller[],
  }
}
