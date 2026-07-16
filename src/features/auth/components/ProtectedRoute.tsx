'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession, useRole } from '../hooks/use-auth'
import { UserRole } from '../types'
import { hasRole } from '../utils/permissions'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | UserRole[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const session = useSession()
  const role = useRole()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
    } else if (requiredRole && !hasRole(role, requiredRole)) {
      router.push('/403')
    }
  }, [session, role, requiredRole, router, pathname])

  if (!session) {
    return (
      <div className="flex items-center justify-center p-20 select-none">
        <Loader2 className="size-6 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (requiredRole && !hasRole(role, requiredRole)) {
    return null
  }

  return <>{children}</>
}
