'use client'

import React, { useState } from 'react'
import { useAdminPayments } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { SearchToolbar } from '@/features/admin/components/SearchToolbar'
import { FilterPanel } from '@/features/admin/components/FilterPanel'
import { PaymentsTable } from '@/features/admin/components/PaymentsTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<string>('all')

  const { data: payments, isLoading, error } = useAdminPayments(search, status)

  const statusOptions = [
    { label: 'All Payments', value: 'all' },
    { label: 'Completed (Paid)', value: 'paid' },
    { label: 'Pending', value: 'pending' },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Stellar Payments Audit"
        description="Verify payments made in XLM via Stellar Horizon ledger transactions."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search hash or accounts..." />
        <FilterPanel value={status} onChange={setStatus} options={statusOptions} label="Status" />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
          Failed to load payments ledger list.
        </div>
      ) : !payments || payments.length === 0 ? (
        <EmptyState title="No transactions found" description="Try broadening your search term or selecting another payment status filter." />
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </div>
  )
}
