'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Store } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useBuyerDashboard } from '@/features/buyer/hooks/use-buyer-queries'
import { DashboardHeader } from '@/features/buyer/components/DashboardHeader'
import { OrderPreviewCard } from '@/features/buyer/components/OrderPreviewCard'
import { RecommendedProducts } from '@/features/buyer/components/RecommendedProducts'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function BuyerDashboardPage() {
  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')
  const [buyerName, setBuyerName] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
        setBuyerName(user.user_metadata?.full_name || '')
      }
    })
  }, [])

  const { data: dashboardData, isLoading } = useBuyerDashboard(buyerId)

  if (isLoading || !buyerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 lg:col-span-2 rounded-none" />
          <Skeleton className="h-48 rounded-none" />
        </div>
        <Skeleton className="h-72 w-full rounded-none" />
      </div>
    )
  }

  const welcomeMessage = buyerName ? `Welcome back, ${buyerName}!` : 'Welcome back!'

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Buyer Dashboard"
        description="Manage your cart, track order statuses, and discover fresh local produce."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-card lg:col-span-2 rounded-none">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold tracking-tight text-foreground font-heading">
              {welcomeMessage}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0 space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              From your buyer portal, you can monitor your active product orders, review item details in your shopping cart, and search the public marketplace to trade fresh farm foods.
            </p>

            <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider select-none">Saved Cart Summary</span>
                <p className="text-sm font-semibold text-foreground">
                  {dashboardData?.cartTotalItems || 0} unique item{(dashboardData?.cartTotalItems ?? 0) !== 1 ? 's' : ''} • Grand Total: <strong className="text-emerald-600 dark:text-emerald-400">${(dashboardData?.cartGrandTotal || 0).toFixed(2)}</strong>
                </p>
              </div>
              <Link
                href="/buyer/cart"
                className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'cursor-pointer font-sans shrink-0')}
              >
                <ShoppingCart className="size-4 mr-1.5" />
                Open Cart
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card rounded-none h-fit">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-6 flex flex-col gap-3">
            <Link
              href="/marketplace"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-start cursor-pointer font-sans')}
            >
              <Store className="size-4 mr-2 text-emerald-600 dark:text-emerald-500" />
              Browse Marketplace
            </Link>
            <Link
              href="/buyer/cart"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full justify-start cursor-pointer font-sans')}
            >
              <ShoppingCart className="size-4 mr-2 text-emerald-600 dark:text-emerald-500" />
              My Shopping Cart
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-border bg-card lg:col-span-2 rounded-none">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-2">
            {!dashboardData || dashboardData.recentOrders.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground select-none">
                You haven't placed any orders yet. Listings you buy will appear here.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {dashboardData.recentOrders.map((order) => (
                  <OrderPreviewCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {dashboardData && dashboardData.recommendedProducts.length > 0 && (
        <RecommendedProducts products={dashboardData.recommendedProducts} />
      )}
    </div>
  )
}
