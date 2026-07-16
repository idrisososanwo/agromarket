'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useProfile } from '@/features/profile/hooks/use-profile-queries'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { User, Settings, Shield, Bell, Sliders, ArrowRight, UserCheck } from 'lucide-react'

export default function ProfilePage() {
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
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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

  const navigationHub = [
    { label: 'Edit Profile Details', href: '/profile/edit', desc: 'Update your display name, contact phone, and avatar photo.', icon: User },
    { label: 'Security & Password', href: '/profile/security', desc: 'Change password or modify account email verification links.', icon: Shield },
    { label: 'Notification Settings', href: '/profile/notifications', desc: 'Manage emails and browser push notification logs.', icon: Bell },
    { label: 'Marketplace Preferences', href: '/profile/preferences', desc: 'Configure default currency conversions or language tags.', icon: Sliders },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Account Hub</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage credentials, preferences, and details.</p>
      </div>

      <Card className="border border-border bg-card rounded-none">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="size-20 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || 'Avatar'}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="size-10 text-muted-foreground stroke-[1.2]" />
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {profile.full_name || 'AgroMarket Member'}
              </h2>
              <span className="self-center sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-muted text-muted-foreground rounded-none select-none">
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans max-w-lg">
              {profile.bio || 'This user has not written a bio yet.'}
            </p>
            {profile.city && profile.country && (
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block select-none">
                Location: {profile.city}, {profile.country}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navigationHub.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-border bg-card p-6 flex items-start gap-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
          >
            <item.icon className="size-6 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold text-foreground block uppercase tracking-wide">
                {item.label}
              </span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground self-center shrink-0" />
          </Link>
        ))}

        {profile.role === 'seller' ? (
          <Link
            href="/seller/profile"
            className="border border-border bg-card p-6 flex items-start gap-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors md:col-span-2"
          >
            <UserCheck className="size-6 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold text-foreground block uppercase tracking-wide">
                Farm & Business settings
              </span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Configure your farm name, business description, years of experience, and view verification status.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground self-center shrink-0" />
          </Link>
        ) : (
          <Link
            href="/buyer/profile"
            className="border border-border bg-card p-6 flex items-start gap-4 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors md:col-span-2"
          >
            <UserCheck className="size-6 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <span className="text-xs font-bold text-foreground block uppercase tracking-wide">
                Buyer Settings & Saved Addresses
              </span>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Configure your delivery addresses and default contact information.
              </p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground self-center shrink-0" />
          </Link>
        )}
      </div>
    </div>
  )
}
