'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingBag, DollarSign, ListOrdered, Plus, Store } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { useSellerDashboard } from '@/features/seller/hooks/use-seller-queries'
import { DashboardHeader } from '@/features/seller/components/DashboardHeader'
import { StatsCard } from '@/features/seller/components/StatsCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function SellerDashboardPage() {
  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSellerId(user.id)
    })
  }, [])

  const { data: stats, isLoading, isError } = useSellerDashboard(sellerId)

  if (isLoading || !sellerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-28 rounded-none" />
          <Skeleton className="h-28 rounded-none" />
          <Skeleton className="h-28 rounded-none" />
          <Skeleton className="h-28 rounded-none" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-none" />
          <Skeleton className="h-96 rounded-none" />
        </div>
      </div>
    )
  }

  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(stats?.revenue || 0)

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Seller Dashboard"
        description="Overview of your business performance, product listings, and order status."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          description="Total items listed on marketplace"
          icon={<ShoppingBag className="size-4" />}
        />
        <StatsCard
          title="Active Listings"
          value={stats?.activeProducts || 0}
          description="Currently visible to buyers"
          icon={<Store className="size-4" />}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          description="Orders placed by customers"
          icon={<ListOrdered className="size-4" />}
        />
        <StatsCard
          title="Total Revenue"
          value={formattedRevenue}
          description="Earned from completed sales"
          icon={<DollarSign className="size-4 text-emerald-600 dark:text-emerald-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-card lg:col-span-2">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-2">
            {!stats || stats.recentOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground select-none">
                No orders placed yet.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="py-4 flex items-center justify-between first:pt-2 last:pb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {order.products?.title || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Buyer: {order.profiles?.full_name || 'AgroMarket Buyer'} • Qty: {order.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        ${Number(order.total_price).toFixed(2)}
                      </p>
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${
                        order.status === 'completed' 
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : order.status === 'pending'
                          ? 'text-amber-600'
                          : 'text-red-500'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card h-fit">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-6 flex flex-col gap-3">
            <Link
              href="/seller/products/new"
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }), "w-full justify-start cursor-pointer font-sans")}
            >
              <Plus className="size-4 mr-2" />
              Add New Product
            </Link>
            <Link
              href="/seller/products"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "w-full justify-start cursor-pointer font-sans")}
            >
              <ShoppingBag className="size-4 mr-2" />
              Manage Listings
            </Link>
            <Link
              href="/seller/orders"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "w-full justify-start cursor-pointer font-sans")}
            >
              <ListOrdered className="size-4 mr-2" />
              View Orders Queue
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
