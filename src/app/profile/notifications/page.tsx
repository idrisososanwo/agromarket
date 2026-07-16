'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/features/profile/hooks/use-profile-queries'
import { NotificationSettings } from '@/features/profile/components/NotificationSettings'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: profile, isLoading } = useProfile(userId)

  if (isLoading || !userId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-muted-foreground">Profile not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8 select-none">
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
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Notifications</h1>
        <p className="text-xs text-muted-foreground mt-1">Configure email alerts and browser push messages.</p>
      </div>

      <NotificationSettings profile={profile} />
    </div>
  )
}
