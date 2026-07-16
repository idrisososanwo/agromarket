import { createClient } from '@/lib/supabase/client'

const POPULAR_SEARCHES_DEFAULT = [
  'Cassava',
  'Maize',
  'Organic Tomatoes',
  'Yam tubers',
  'Fertilizer',
  'Cocoa beans',
]

export async function getRecentSearches(): Promise<{
  recentSearches: string[]
  popularSearches: string[]
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let recent: string[] = []

  if (user) {
    const { data } = await supabase
      .from('search_history')
      .select('search_term')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(6)

    if (data) {
      recent = data.map((d) => d.search_term)
    }
  }

  // Calculate popular searches dynamically from overall search history or return defaults
  const { data: popularData } = await supabase
    .rpc('get_popular_search_terms') // optional postgres RPC if present
    .limit(6)

  const popular = popularData 
    ? (popularData as any[]).map((p) => p.search_term)
    : POPULAR_SEARCHES_DEFAULT

  return {
    recentSearches: recent,
    popularSearches: popular,
  }
}
