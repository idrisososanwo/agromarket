'use client'

import React, { useState, useEffect } from 'react'
import { Check, X, ClipboardList, Calendar } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useSellerOrders, useUpdateOrderStatus } from '@/features/seller/hooks/use-seller-queries'
import { DashboardHeader } from '@/features/seller/components/DashboardHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductImage } from '@/features/marketplace/components/ProductImage'

export default function SellerOrdersPage() {
  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSellerId(user.id)
    })
  }, [])

  const { data: orders, isLoading } = useSellerOrders(sellerId)
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus()

  const handleUpdateStatus = (orderId: string, status: 'completed' | 'cancelled') => {
    updateStatus({ orderId, status, sellerId })
  }

  if (isLoading || !sellerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-full rounded-none" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Orders Queue"
        description="Monitor orders, track customer shipments, and update fulfillment status."
      />

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const date = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
            }).format(new Date(order.created_at))

            return (
              <Card key={order.id} className="border border-border bg-card rounded-none overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left Side: Product Details & Buyer */}
                  <div className="flex items-center gap-4">
                    <div className="size-16 border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                      <ProductImage
                        src={order.products?.image_url || null}
                        title={order.products?.title || 'Product'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        {order.products?.title || 'Unknown Product'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Buyer: <span className="font-medium text-foreground">{order.profiles?.full_name || 'AgroMarket Customer'}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          Ordered: {date}
                        </span>
                        <span>
                          Qty: <strong className="text-foreground">{order.quantity}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Total Price & Status Controls */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-border pt-4 md:pt-0 gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-muted-foreground">Total Price</p>
                      <p className="text-lg font-bold text-foreground">
                        ${Number(order.total_price).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border ${
                        order.status === 'completed'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900/30'
                          : order.status === 'pending'
                          ? 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/20'
                          : 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20'
                      }`}>
                        {order.status}
                      </span>

                      {order.status === 'pending' && (
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            className="cursor-pointer size-7 p-0"
                            title="Mark as Completed"
                          >
                            <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="cursor-pointer size-7 p-0"
                            title="Cancel Order"
                          >
                            <X className="size-3.5 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-none bg-zinc-50/50 dark:bg-zinc-900/10">
          <ClipboardList className="size-12 text-zinc-400 stroke-[1.2] mb-3" />
          <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">No Orders Yet</h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Your products haven't received any orders yet. Once buyers purchase your listed produce, they will show up here.
          </p>
        </div>
      )}
    </div>
  )
}
