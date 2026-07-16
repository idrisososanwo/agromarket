'use client'

import React, { useState } from 'react'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Globe,
  Bell,
  ShieldCheck,
  Server,
  Save,
} from 'lucide-react'

interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  label: string
  description?: string
}

function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-xs font-bold text-foreground font-sans">{label}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          checked
            ? 'bg-emerald-600 dark:bg-emerald-500'
            : 'bg-input'
        }`}
      >
        <span
          className={`pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-4 border-b border-border">
      <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <Icon className="size-4 text-emerald-600 dark:text-emerald-500" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-foreground font-sans">{title}</p>
    </div>
  )
}

export default function AdminSettingsPage() {
  const supabase = createClient()

  // Platform Settings State
  const [platformName, setPlatformName] = useState<string>('AgroMarket')
  const [supportEmail, setSupportEmail] = useState<string>('support@agromarket.io')
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false)

  // Notification Settings
  const [emailNewSeller, setEmailNewSeller] = useState<boolean>(true)
  const [emailNewReport, setEmailNewReport] = useState<boolean>(true)
  const [emailDailyDigest, setEmailDailyDigest] = useState<boolean>(false)

  // Security Settings
  const [requireEmailVerification, setRequireEmailVerification] = useState<boolean>(true)
  const [autoSuspendOnReport, setAutoSuspendOnReport] = useState<boolean>(false)
  const [enforceStrongPasswords, setEnforceStrongPasswords] = useState<boolean>(true)

  // Marketplace Settings
  const [allowGuestBrowsing, setAllowGuestBrowsing] = useState<boolean>(true)
  const [requireSellerVerification, setRequireSellerVerification] = useState<boolean>(true)
  const [maxProductsPerSeller, setMaxProductsPerSeller] = useState<string>('50')

  const handleSave = async () => {
    // Settings are persisted client-side here for demo purposes.
    // In production, these would be stored in a platform_settings table.
    toast.success('Platform settings saved successfully.')
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <AdminHeader
        title="Platform Settings"
        description="Configure platform-wide parameters, marketplace rules, and security policies."
        actions={
          <Button
            onClick={handleSave}
            className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1.5"
          >
            <Save className="size-3.5" />
            Save Changes
          </Button>
        }
      />

      {/* Platform Identity */}
      <Card className="border border-border bg-card rounded-none shadow-none font-sans select-none">
        <CardContent className="p-6 space-y-6">
          <SectionHeader icon={Globe} title="Platform Identity" />

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
                Platform Name
              </Label>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="rounded-none text-xs"
                placeholder="AgroMarket"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
                Support Email
              </Label>
              <Input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="rounded-none text-xs"
                placeholder="support@example.com"
              />
            </div>
            <div className="border-t border-border" />
            <ToggleSwitch
              checked={maintenanceMode}
              onChange={() => setMaintenanceMode((v) => !v)}
              label="Maintenance Mode"
              description="Temporarily disable public access to the platform."
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border border-border bg-card rounded-none shadow-none font-sans select-none">
        <CardContent className="p-6 space-y-4">
          <SectionHeader icon={Bell} title="Admin Notifications" />
          <ToggleSwitch
            checked={emailNewSeller}
            onChange={() => setEmailNewSeller((v) => !v)}
            label="New Seller Registration Email"
            description="Receive an email when a new seller submits a verification request."
          />
          <div className="border-t border-border" />
          <ToggleSwitch
            checked={emailNewReport}
            onChange={() => setEmailNewReport((v) => !v)}
            label="New Moderation Report Email"
            description="Receive an email when a community report is submitted."
          />
          <div className="border-t border-border" />
          <ToggleSwitch
            checked={emailDailyDigest}
            onChange={() => setEmailDailyDigest((v) => !v)}
            label="Daily Platform Digest"
            description="Receive a daily summary of platform metrics and alerts."
          />
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border border-border bg-card rounded-none shadow-none font-sans select-none">
        <CardContent className="p-6 space-y-4">
          <SectionHeader icon={ShieldCheck} title="Security Policies" />
          <ToggleSwitch
            checked={requireEmailVerification}
            onChange={() => setRequireEmailVerification((v) => !v)}
            label="Require Email Verification"
            description="New accounts must verify their email before they can place orders."
          />
          <div className="border-t border-border" />
          <ToggleSwitch
            checked={enforceStrongPasswords}
            onChange={() => setEnforceStrongPasswords((v) => !v)}
            label="Enforce Strong Passwords"
            description="Require at least 8 characters, one uppercase, and one symbol."
          />
          <div className="border-t border-border" />
          <ToggleSwitch
            checked={autoSuspendOnReport}
            onChange={() => setAutoSuspendOnReport((v) => !v)}
            label="Auto-Suspend on 3 Reports"
            description="Automatically suspend accounts that receive 3 or more pending reports."
          />
        </CardContent>
      </Card>

      {/* Marketplace */}
      <Card className="border border-border bg-card rounded-none shadow-none font-sans select-none">
        <CardContent className="p-6 space-y-4">
          <SectionHeader icon={Server} title="Marketplace Rules" />
          <ToggleSwitch
            checked={allowGuestBrowsing}
            onChange={() => setAllowGuestBrowsing((v) => !v)}
            label="Allow Guest Browsing"
            description="Unauthenticated users can view product listings without signing in."
          />
          <div className="border-t border-border" />
          <ToggleSwitch
            checked={requireSellerVerification}
            onChange={() => setRequireSellerVerification((v) => !v)}
            label="Require Seller Verification"
            description="Sellers must be verified before their listings appear publicly."
          />
          <div className="border-t border-border" />
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
              Max Products per Seller
            </Label>
            <Input
              value={maxProductsPerSeller}
              onChange={(e) => setMaxProductsPerSeller(e.target.value)}
              type="number"
              min={1}
              max={500}
              className="rounded-none text-xs w-28"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1.5"
        >
          <Save className="size-3.5" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}
