import { createClient } from '@/lib/supabase/client'
import { SellerProfile } from '../types'

export async function getSellerProfile(userId: string): Promise<SellerProfile | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('seller_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as SellerProfile) || null
}
