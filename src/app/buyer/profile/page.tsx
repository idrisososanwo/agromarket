'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/features/profile/hooks/use-profile-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, User, Edit } from 'lucide-react'

export default function BuyerProfilePage() {
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
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Delivery Settings</h1>
        <Button
          onClick={() => router.push('/profile/edit')}
          size="sm"
          variant="outline"
          className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider gap-1.5"
        >
          <Edit className="size-4" />
          Edit Details
        </Button>
      </div>

      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
            Saved Delivery Coordinates
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 font-sans">
          <div className="flex items-start gap-3">
            <User className="size-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Default Recipient Name</span>
              <p className="text-xs font-bold text-foreground mt-0.5">
                {profile.full_name || 'Not configured'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-border pt-6">
            <Phone className="size-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Contact Phone Number</span>
              <p className="text-xs font-bold text-foreground mt-0.5">
                {profile.phone || 'Not configured'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-border pt-6">
            <MapPin className="size-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Saved Shipping Address</span>
              {profile.address ? (
                <div className="text-xs font-bold text-foreground mt-1 leading-relaxed whitespace-pre-line">
                  {profile.address}
                  <br />
                  {profile.city}, {profile.state} {profile.postal_code}
                  <br />
                  {profile.country}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">No address saved yet. Fill it in to speed up checkout.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
