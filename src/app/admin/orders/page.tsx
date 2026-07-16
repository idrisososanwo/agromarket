'use client'

import React, { useState } from 'react'
import { useAdminOrders } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { SearchToolbar } from '@/features/admin/components/SearchToolbar'
import { FilterPanel } from '@/features/admin/components/FilterPanel'
import { OrdersTable } from '@/features/admin/components/OrdersTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminOrdersPage() {
  const [search, setSearch] = useState<string>('')
  const [status, setStatus] = useState<string>('all')

  const { data: orders, isLoading, error } = useAdminOrders(search, status)

  const statusOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Awaiting Payment', value: 'awaiting_payment' },
    { label: 'Processing', value: 'processing' },
    { label: 'Dispatched', value: 'dispatched' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Orders Audit Logs"
        description="Inspect system order flows, payment statuses, and shipment schedules."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search orders..." />
        <FilterPanel value={status} onChange={setStatus} options={statusOptions} label="Status" />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
          Failed to load orders audit list.
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState title="No orders found" description="Try broadening your search term or selecting another status filter." />
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  )
}
