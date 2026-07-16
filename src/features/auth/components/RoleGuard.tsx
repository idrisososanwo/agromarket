'use client'

import React from 'react'
import { useRole } from '../hooks/use-auth'
import { UserRole } from '../types'
import { hasRole } from '../utils/permissions'
import { UnauthorizedCard } from './UnauthorizedCard'

interface RoleGuardProps {
  children: React.ReactNode
  requiredRole: UserRole | UserRole[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const role = useRole()

  const allowed = hasRole(role, requiredRole)

  if (!allowed) {
    return <>{fallback || <UnauthorizedCard />}</>
  }

  return <>{children}</>
}
