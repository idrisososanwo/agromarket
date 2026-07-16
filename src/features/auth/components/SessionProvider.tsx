'use client'

import React, { createContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { UserRole, Permission } from '../types'
import { ROLE_PERMISSIONS } from '../utils/permissions'
import { Loader2 } from 'lucide-react'

interface SessionContextType {
  user: User | null
  session: Session | null
  role: UserRole | null
  permissions: Permission[]
  isLoading: boolean
}

export const SessionContext = createContext<SessionContextType>({
  user: null,
  session: null,
  role: null,
  permissions: [],
  isLoading: true,
})

export function useSession() {
  return React.useContext(SessionContext)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        if (initialSession) {
          setSession(initialSession)
          setUser(initialSession.user)

          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', initialSession.user.id)
            .maybeSingle()

          const userRole = (profile?.role || 'buyer') as UserRole
          setRole(userRole)
          setPermissions(ROLE_PERMISSIONS[userRole] || [])
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .maybeSingle()

        const userRole = (profile?.role || 'buyer') as UserRole
        setRole(userRole)
        setPermissions(ROLE_PERMISSIONS[userRole] || [])
      } else {
        setRole(null)
        setPermissions([])
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (session) {
        try {
          const { data: { session: refreshed } } = await supabase.auth.refreshSession()
          if (refreshed) {
            setSession(refreshed)
          }
        } catch (err) {
          console.error('Failed to periodically refresh session:', err)
        }
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [session, supabase])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50 select-none">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 text-emerald-600 dark:text-emerald-500 animate-spin stroke-[1.5]" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            Verifying Credentials
          </span>
        </div>
      </div>
    )
  }

  return (
    <SessionContext.Provider value={{ user, session, role, permissions, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}
