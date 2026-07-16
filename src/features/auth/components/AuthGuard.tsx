'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from '../hooks/use-auth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`)
    }
  }, [session, router, pathname])

  if (!session) return null

  return <>{children}</>
}
