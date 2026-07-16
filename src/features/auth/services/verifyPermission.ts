import { createClient } from '@/lib/supabase/client'
import { Permission, UserRole } from '../types'
import { hasPermission } from '../utils/permissions'

export async function verifyPermission(permission: Permission): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = (profile?.role || 'buyer') as UserRole
  return hasPermission(role, permission)
}
