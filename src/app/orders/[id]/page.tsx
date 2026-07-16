'use client'

import React, { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOrderDetailsQuery, useCancelOrder } from '@/features/orders/hooks/use-orders-queries'
import { InvoiceCard } from '@/features/orders/components/InvoiceCard'
import { OrderTimeline } from '@/features/orders/components/OrderTimeline'
import { SellerOrderActions } from '@/features/orders/components/SellerOrderActions'
import { CancelOrderDialog } from '@/features/orders/components/CancelOrderDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Ban } from 'lucide-react'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function OrderDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const orderId = resolvedParams.id

  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')
  const [isCancelOpen, setIsCancelOpen] = useState(false)

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
  const { mutate: cancelPurchase, isPending: isCancelling } = useCancelOrder()

  if (isLoading || !userId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-none" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-none" />
          </div>
        </div>
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

  const isBuyer = order.buyer_id === userId
  const isSeller = order.order_items.some((item) => item.seller_id === userId)

  if (!isBuyer && !isSeller) {
    return (
      <div className="text-center py-20 select-none">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-red-500">Access Denied</h3>
        <p className="text-xs text-muted-foreground mt-1">You are not authorized to view this order details.</p>
        <Button
          onClick={() => router.push('/')}
          className="mt-6 cursor-pointer rounded-none text-xs uppercase font-bold tracking-wider"
        >
          Return Home
        </Button>
      </div>
    )
  }

  const canBuyerCancel =
    isBuyer && (order.order_status === 'awaiting_payment' || order.order_status === 'confirmed')

  const handleCancelConfirm = (reason: string) => {
    cancelPurchase(
      { orderId: order.id, buyerId: userId, reason },
      {
        onSuccess: () => {
          setIsCancelOpen(false)
        },
      }
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 print:py-0 print:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        {canBuyerCancel && (
          <Button
            onClick={() => setIsCancelOpen(true)}
            variant="destructive"
            size="sm"
            className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
          >
            <Ban className="size-4" />
            Cancel Order
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <InvoiceCard order={order} />
        </div>

        <div className="space-y-6 print:hidden">
          <OrderTimeline
            status={order.order_status}
            shippedAt={order.shipped_at}
            deliveredAt={order.delivered_at}
            cancelledAt={order.cancelled_at}
            cancelledReason={order.cancelled_reason}
          />

          {isSeller && (
            <SellerOrderActions
              orderId={order.id}
              currentStatus={order.order_status}
              sellerId={userId}
            />
          )}

          {order.tracking_number && (
            <div className="border border-border p-4 bg-zinc-50 dark:bg-zinc-900/50 space-y-2 select-none">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Logistics Courier Details</span>
              <p className="text-xs font-semibold text-foreground">Tracking Number: {order.tracking_number}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/orders/tracking/${order.id}`)}
                className="w-full text-[10px] uppercase font-bold tracking-wider rounded-none mt-2"
              >
                Track Shipment Details
              </Button>
            </div>
          )}
        </div>
      </div>

      <CancelOrderDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        isPending={isCancelling}
      />
    </div>
  )
}
