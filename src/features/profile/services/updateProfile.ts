import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '../types'

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    throw new Error(error.message)
  }
}
