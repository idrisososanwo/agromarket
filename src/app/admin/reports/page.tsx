'use client'

import React, { useState } from 'react'
import { useAdminReports } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { FilterPanel } from '@/features/admin/components/FilterPanel'
import { ReportsTable } from '@/features/admin/components/ReportsTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminReportsPage() {
  const [status, setStatus] = useState<string>('all')
  const [targetType, setTargetType] = useState<string>('all')

  const { data: reports, isLoading, error } = useAdminReports(status, targetType)

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Dismissed', value: 'dismissed' },
  ]

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Buyer', value: 'buyer' },
    { label: 'Seller', value: 'seller' },
    { label: 'Product', value: 'product' },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Moderation Reports"
        description="Review community reports, resolve flagged items, and dismiss invalid submissions."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <FilterPanel value={status} onChange={setStatus} options={statusOptions} label="Status" />
        <FilterPanel value={targetType} onChange={setTargetType} options={typeOptions} label="Target" />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
          Failed to load moderation reports.
        </div>
      ) : !reports || reports.length === 0 ? (
        <EmptyState title="No reports found" description="There are no moderation reports matching your current filters." />
      ) : (
        <ReportsTable reports={reports} />
      )}
    </div>
  )
}
