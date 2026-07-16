'use client'

import React, { useState } from 'react'
import { useAdminUsers } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { SearchToolbar } from '@/features/admin/components/SearchToolbar'
import { FilterPanel } from '@/features/admin/components/FilterPanel'
import { UserTable } from '@/features/admin/components/UserTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminUsersPage() {
  const [search, setSearch] = useState<string>('')
  const [role, setRole] = useState<string>('all')

  const { data: users, isLoading, error } = useAdminUsers(search, role)

  const roleOptions = [
    { label: 'All Roles', value: 'all' },
    { label: 'Buyers', value: 'buyer' },
    { label: 'Sellers', value: 'seller' },
    { label: 'Admins', value: 'admin' },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Users Management"
        description="Search, filter, inspect, and suspend platform users."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search members..." />
        <FilterPanel value={role} onChange={setRole} options={roleOptions} label="Role" />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
          Failed to load users list.
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState title="No members found" description="Try broadening your search term or selecting another role filter." />
      ) : (
        <UserTable users={users} />
      )}
    </div>
  )
}
