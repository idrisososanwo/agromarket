'use client'

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOrderDetailsQuery } from '@/features/orders/hooks/use-orders-queries'
import { OrderTimeline } from '@/features/orders/components/OrderTimeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Truck, Calendar, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderTrackingPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const orderId = resolvedParams.id

  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: order, isLoading } = useOrderDetailsQuery(orderId)

  if (isLoading || !userId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20 select-none">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Order Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">Please check your order reference and try again.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 select-none">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Track Shipment</h1>
        <p className="text-xs text-muted-foreground mt-1">Order Ref: {order.id}</p>
      </div>

      <OrderTimeline
        status={order.order_status}
        shippedAt={order.shipped_at}
        deliveredAt={order.delivered_at}
        cancelledAt={order.cancelled_at}
        cancelledReason={order.cancelled_reason}
      />

      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
            Logistics Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 font-sans">
          {order.delivered_at && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600">
                  <MapPin className="size-4" />
                </div>
                <div className="w-0.5 bg-border flex-1 mt-2" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground">Package Delivered</span>
                <p className="text-xs text-muted-foreground leading-relaxed">The courier successfully delivered the package to: {order.delivery_name}</p>
                <span className="text-[10px] text-muted-foreground block">
                  {new Date(order.delivered_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {order.shipped_at && (
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-8 rounded-full border border-sky-600 bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-600">
                  <Truck className="size-4" />
                </div>
                {order.delivered_at && <div className="w-0.5 bg-border flex-1 mt-2" />}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground">Package Dispatched</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The order was handed over to the courier. Tracking code: <strong>{order.tracking_number}</strong>
                </p>
                <span className="text-[10px] text-muted-foreground block">
                  {new Date(order.shipped_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="size-8 rounded-full border border-border bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center text-foreground">
                <Calendar className="size-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground">Order Placed</span>
              <p className="text-xs text-muted-foreground leading-relaxed">The purchase order has been successfully logged and processed in our database system.</p>
              <span className="text-[10px] text-muted-foreground block">
                {new Date(order.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
