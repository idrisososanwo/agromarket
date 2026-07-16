import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

export async function getCurrentSession(): Promise<Session | null> {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error || !session) return null
  return session
}
