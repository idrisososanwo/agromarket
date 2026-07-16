'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useUpdateProfile } from '../hooks/use-profile-queries'
import { UserProfile } from '../types'

interface PreferencesCardProps {
  profile: UserProfile
}

export function PreferencesCard({ profile }: PreferencesCardProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const handleChange = (key: 'preferred_language' | 'preferred_currency', value: string) => {
    updateProfile({
      userId: profile.id,
      updates: {
        [key]: value,
      },
    })
  }

  return (
    <Card className="border border-border bg-card rounded-none">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
          Marketplace Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="lang" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            Preferred Language
          </Label>
          <select
            id="lang"
            value={profile.preferred_language}
            disabled={isPending}
            onChange={(e) => handleChange('preferred_language', e.target.value)}
            className="w-full border border-border bg-card text-xs rounded-none p-2.5 font-sans focus-visible:ring-emerald-600 focus-visible:ring-2 outline-none cursor-pointer"
          >
            <option value="en">English (US)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
          </select>
        </div>

        <div className="space-y-1.5 border-t border-border pt-6">
          <Label htmlFor="currency" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
            Preferred Currency
          </Label>
          <select
            id="currency"
            value={profile.preferred_currency}
            disabled={isPending}
            onChange={(e) => handleChange('preferred_currency', e.target.value)}
            className="w-full border border-border bg-card text-xs rounded-none p-2.5 font-sans focus-visible:ring-emerald-600 focus-visible:ring-2 outline-none cursor-pointer"
          >
            <option value="USD">USD ($) - US Dollar</option>
            <option value="EUR">EUR (€) - Euro</option>
            <option value="XLM">XLM (stellar) - Stellar Lumens</option>
          </select>
        </div>
      </CardContent>
    </Card>
  )
}
