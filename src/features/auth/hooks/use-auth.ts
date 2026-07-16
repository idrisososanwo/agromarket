'use client'

import { useContext } from 'react'
import { SessionContext } from '../components/SessionProvider'
import { UserRole, Permission } from '../types'
import { User, Session } from '@supabase/supabase-js'

export function useSession(): Session | null {
  const { session } = useContext(SessionContext)
  return session
}

export function useUser(): User | null {
  const { user } = useContext(SessionContext)
  return user
}

export function useRole(): UserRole | null {
  const { role } = useContext(SessionContext)
  return role
}

export function usePermissions(): Permission[] {
  const { permissions } = useContext(SessionContext)
  return permissions
}
