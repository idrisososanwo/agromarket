'use client'

import React from 'react'
import { useAdminStats } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { DashboardStats } from '@/features/admin/components/DashboardStats'
import { AnalyticsChart } from '@/features/admin/components/AnalyticsChart'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'

export default function AdminOverviewPage() {
  const { data: stats, isLoading, error } = useAdminStats()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
        Failed to load platform dashboard stats.
      </div>
    )
  }

  return (
    <div className="space-y-8 select-none">
      <AdminHeader
        title="System Overview"
        description="Monitor system metrics, seller registration queries, and total volume details."
      />

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 gap-6">
        <AnalyticsChart />
      </div>
    </div>
  )
}
