import { createClient } from '@/lib/supabase/client'
import { SellerProfile } from '../types'

export async function updateSellerProfile(
  userId: string,
  updates: Partial<Omit<SellerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const supabase = createClient()

  const { data: existing } = await supabase
    .from('seller_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('seller_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('seller_profiles')
      .insert({
        user_id: userId,
        ...updates,
        verification_status: 'pending',
      })

    if (error) throw new Error(error.message)
  }
}
