'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { SellerProfileAdmin } from '@/features/admin/types'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { SellerVerificationTable } from '@/features/admin/components/SellerVerificationTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminSellersPage() {
  const supabase = createClient()
  const [sellers, setSellers] = useState<SellerProfileAdmin[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchSellers() {
      try {
        const { data, error } = await supabase
          .from('seller_profiles')
          .select('*, profiles:user_id(id, full_name, email, is_suspended)')
          .order('created_at', { ascending: false })

        if (data) {
          setSellers(data as SellerProfileAdmin[])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSellers()
  }, [supabase])

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Seller Verification Queue"
        description="Verify farm credentials, years of experience, and review submitted business descriptions."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : !sellers || sellers.length === 0 ? (
        <EmptyState title="Verification Queue Clean" description="There are no seller profiles awaiting verification audits." />
      ) : (
        <SellerVerificationTable sellers={sellers} />
      )}
    </div>
  )
}
