import { createClient } from '@/lib/supabase/client'
import { UserRole } from '../types'
import { hasRole } from '../utils/permissions'

export async function requireRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = (profile?.role || 'buyer') as UserRole
  return hasRole(role, requiredRole)
}
