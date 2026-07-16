'use client'

import React from 'react'
import { useAdminStats } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { AnalyticsChart } from '@/features/admin/components/AnalyticsChart'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

function MetricCard({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string
  value: string | number
  sublabel?: string
  accent?: string
}) {
  return (
    <Card className="border border-border bg-card rounded-none shadow-none font-sans select-none">
      <CardContent className="p-6 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className={`text-3xl font-bold tracking-tight ${accent ?? 'text-foreground'}`}>{value}</p>
        {sublabel && <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{sublabel}</p>}
      </CardContent>
    </Card>
  )
}

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading || !stats) return <LoadingSkeleton />

  const sellerRatio =
    stats.totalUsers > 0 ? ((stats.totalSellers / stats.totalUsers) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Platform Analytics"
        description="Inspect platform-wide growth metrics, user acquisition, and revenue trends."
      />

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          sublabel="Platform members"
        />
        <MetricCard
          label="Total Sellers"
          value={stats.totalSellers.toLocaleString()}
          sublabel={`${sellerRatio}% of all users`}
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          label="Active Listings"
          value={stats.activeListings.toLocaleString()}
          sublabel="Live marketplace products"
          accent="text-blue-600 dark:text-blue-400"
        />
        <MetricCard
          label="Pending Verifications"
          value={stats.pendingSellerVerifications.toLocaleString()}
          sublabel="Sellers awaiting review"
          accent="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          label="Total Revenue (USD)"
          value={`$${Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sublabel="All-time platform volume"
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          label="Orders Today"
          value={stats.ordersToday.toLocaleString()}
          sublabel="Transactions placed this calendar day"
        />
      </div>

      {/* Growth Chart */}
      <Card className="border border-border bg-card rounded-none shadow-none">
        <CardHeader className="p-6 border-b border-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans">
            Monthly Platform Activity
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <AnalyticsChart />
        </CardContent>
      </Card>
    </div>
  )
}
