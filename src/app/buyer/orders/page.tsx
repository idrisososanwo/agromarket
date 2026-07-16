'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useBuyerOrders } from '@/features/orders/hooks/use-orders-queries'
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Eye } from 'lucide-react'
import { OrderStatus } from '@/features/orders/types'

export default function BuyerOrdersPage() {
  const router = useRouter()
  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: orders, isLoading } = useBuyerOrders(buyerId, statusFilter, search)

  if (isLoading || !buyerId) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-24 w-full rounded-none" />
          <Skeleton className="h-24 w-full rounded-none" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8 select-none">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Purchase History</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage and track your ordered marketplace products.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient name..."
            className="rounded-none pl-10 text-xs"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="border border-border bg-card text-xs rounded-none px-3 font-mono font-bold uppercase tracking-wider focus-visible:ring-emerald-600 focus-visible:ring-2 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="awaiting_payment">Awaiting Payment</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border border-border bg-card rounded-none hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors"
            >
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono font-bold text-foreground select-all">{order.id}</code>
                    <OrderStatusBadge status={order.order_status} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 text-xs text-muted-foreground font-sans">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider block">Recipient</span>
                      <span className="font-semibold text-foreground mt-0.5 block">{order.delivery_name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider block">Total Amount</span>
                      <span className="font-semibold text-foreground mt-0.5 block">${Number(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider block">Payment</span>
                      <span className="font-semibold text-foreground mt-0.5 block uppercase">{order.payment_status}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider block">Order Date</span>
                      <span className="font-semibold text-foreground mt-0.5 block">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    variant="outline"
                    className="flex-1 md:flex-none cursor-pointer rounded-none text-xs uppercase font-bold tracking-wider gap-1.5"
                  >
                    <Eye className="size-4" />
                    Details
                  </Button>
                  {order.tracking_number && (
                    <Button
                      onClick={() => router.push(`/orders/tracking/${order.id}`)}
                      className="flex-1 md:flex-none cursor-pointer rounded-none text-xs uppercase font-bold tracking-wider"
                    >
                      Track
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border py-16 text-center select-none">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">No orders found</h3>
          <p className="text-xs text-muted-foreground mt-1">You haven&apos;t placed any orders matching the filters.</p>
        </div>
      )}
    </div>
  )
}
