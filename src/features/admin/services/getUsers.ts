import { createClient } from '@/lib/supabase/client'
import { UserProfileAdmin } from '../types'

export async function getUsers(search?: string, roleFilter?: string): Promise<UserProfileAdmin[]> {
  const supabase = createClient()

  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

  if (roleFilter && roleFilter !== 'all') {
    query = query.eq('role', roleFilter)
  }

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []) as UserProfileAdmin[]
}
