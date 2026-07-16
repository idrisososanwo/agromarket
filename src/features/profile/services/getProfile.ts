import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '../types'

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as UserProfile) || null
}
