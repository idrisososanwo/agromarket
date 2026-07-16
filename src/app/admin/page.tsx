'use client'

import React from 'react'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, Users, ShoppingBag, Settings, CreditCard } from 'lucide-react'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none font-sans">
        <div>
          <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Admin Control Center</h1>
          <p className="text-xs text-muted-foreground mt-1">Platform management, audit logs, and security parameters.</p>
        </div>

        <div className="border border-emerald-200 bg-emerald-50/30 dark:border-emerald-950/40 p-4 flex items-center gap-3">
          <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-500 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-400">
              Security Override Enabled
            </span>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-500 mt-0.5">
              You are currently authenticated as a Platform Admin. You have read and write privileges across all entities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-border bg-card rounded-none">
            <CardHeader className="p-6 pb-2">
              <Users className="size-5 text-muted-foreground stroke-[1.5]" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Registered Users</span>
              <p className="text-lg font-bold text-foreground">1,248</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card rounded-none">
            <CardHeader className="p-6 pb-2">
              <ShoppingBag className="size-5 text-muted-foreground stroke-[1.5]" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Marketplace Items</span>
              <p className="text-lg font-bold text-foreground">856</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card rounded-none">
            <CardHeader className="p-6 pb-2">
              <CreditCard className="size-5 text-muted-foreground stroke-[1.5]" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Escrow Accounts</span>
              <p className="text-lg font-bold text-foreground">42</p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card rounded-none">
            <CardHeader className="p-6 pb-2">
              <Settings className="size-5 text-muted-foreground stroke-[1.5]" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">System Status</span>
              <p className="text-lg font-bold text-foreground">Healthy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
