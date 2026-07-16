'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/features/profile/hooks/use-profile-queries'
import { PasswordForm } from '@/features/profile/components/PasswordForm'
import { EmailForm } from '@/features/profile/components/EmailForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function SecurityPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email || '')
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: profile, isLoading } = useProfile(userId)

  if (isLoading || !userId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-full rounded-none" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 select-none">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/profile')}
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back to Hub
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Security & Login</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage passwords and verified email settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <EmailForm currentEmail={userEmail} />
        <PasswordForm />
      </div>
    </div>
  )
}
