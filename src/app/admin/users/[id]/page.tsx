'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserProfileAdmin } from '@/features/admin/types'
import { useSuspendUser } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default function AdminUserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const supabase = createClient()
  const [profile, setProfile] = useState<UserProfileAdmin | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { mutate: toggleSuspend, isPending } = useSuspendUser()

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle()

        if (data) {
          setProfile(data as UserProfileAdmin)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, supabase])

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-20 font-sans select-none text-xs text-muted-foreground uppercase font-bold tracking-wider">
        User profile not found.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 select-none font-sans">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/users')}
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back to Users
        </Button>
      </div>

      <AdminHeader
        title={`Member Profile Detail`}
        description="Inspect system metadata, geographic locations, and security parameters."
      />

      <Card className="border border-border bg-card rounded-none shadow-sm">
        <CardHeader className="p-6 border-b border-border flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="size-20 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="h-full w-full object-cover" />
            ) : (
              <User className="size-10 text-muted-foreground stroke-[1.2]" />
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {profile.full_name || 'AgroMarket Member'}
              </h3>
              <span className="self-center sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-muted text-muted-foreground rounded-none">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              {profile.bio || 'This user has not configured a bio yet.'}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span className="font-bold">Email:</span> {profile.email || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span className="font-bold">Phone:</span> {profile.phone || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span className="font-bold">Location:</span>{' '}
              {profile.city && profile.country ? `${profile.city}, ${profile.country}` : 'Not configured'}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span className="font-bold">Registered:</span>{' '}
              {new Date(profile.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="border-t border-border pt-6 flex justify-end gap-3">
            {profile.is_suspended ? (
              <Button
                onClick={() => {
                  toggleSuspend({ userId: profile.id, isSuspended: false })
                  setProfile((prev) => prev ? { ...prev, is_suspended: false } : null)
                }}
                disabled={isPending}
                className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider"
              >
                Reactivate Account
              </Button>
            ) : (
              <Button
                onClick={() => {
                  toggleSuspend({ userId: profile.id, isSuspended: true })
                  setProfile((prev) => prev ? { ...prev, is_suspended: true } : null)
                }}
                disabled={isPending || profile.role === 'admin'}
                variant="destructive"
                className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider"
              >
                Suspend Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
