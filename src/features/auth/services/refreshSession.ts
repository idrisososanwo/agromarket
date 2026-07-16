import { createClient } from '@/lib/supabase/client'
import { Session } from '@supabase/supabase-js'

export async function refreshSession(): Promise<Session | null> {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.refreshSession()
  if (error || !session) return null
  return session
}
