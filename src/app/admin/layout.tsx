'use client'

import React from 'react'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { AdminSidebar } from '@/features/admin/components/AdminSidebar'
import { AdminNavbar } from '@/features/admin/components/AdminNavbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-background overflow-hidden">
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminNavbar />

          <main className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-zinc-950/20">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
