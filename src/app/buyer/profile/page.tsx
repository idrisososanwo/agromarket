'use client'

import React, { useState, useEffect } from 'react'
import { User, Shield, Mail, Calendar } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { DashboardHeader } from '@/features/buyer/components/DashboardHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BuyerProfilePage() {
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [email, setEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setIsLoading(false)
    }
    fetchProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  const date = profile?.updated_at
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(profile.updated_at))
    : 'N/A'

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Profile"
        description="View your user settings, email address, and active role."
      />

      <Card className="border border-border bg-card rounded-none max-w-xl">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-sm font-bold tracking-wider uppercase text-foreground">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center text-muted-foreground shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider select-none">Full Name</p>
              <p className="text-sm font-semibold text-foreground">{profile?.full_name || 'AgroMarket Member'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center text-muted-foreground shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider select-none">Email Address</p>
              <p className="text-sm font-semibold text-foreground">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center text-muted-foreground shrink-0">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider select-none">Portal Role</p>
              <p className="text-sm font-semibold text-foreground capitalize">{profile?.role || 'Buyer'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center text-muted-foreground shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider select-none">Last Profile Update</p>
              <p className="text-sm font-semibold text-foreground">{date}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
