'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateOrderStatus } from '../hooks/use-orders-queries'
import { OrderStatus } from '../types'
import { Check, Truck, CheckSquare, XOctagon } from 'lucide-react'

interface SellerOrderActionsProps {
  orderId: string
  currentStatus: OrderStatus
  sellerId: string
}

export function SellerOrderActions({ orderId, currentStatus, sellerId }: SellerOrderActionsProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [showShipForm, setShowShipForm] = useState(false)

  const handleUpdate = (status: OrderStatus) => {
    updateStatus({
      orderId,
      newStatus: status,
      userId: sellerId,
      trackingNumber: status === 'shipped' ? trackingNumber : undefined,
    }, {
      onSuccess: () => {
        setShowShipForm(false)
        setTrackingNumber('')
      }
    })
  }

  if (currentStatus === 'delivered' || currentStatus === 'cancelled' || currentStatus === 'refunded') {
    return null
  }

  return (
    <Card className="border border-border bg-card rounded-none h-fit">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
          Fulfillment Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {currentStatus === 'confirmed' && (
          <div className="space-y-2">
            <Button
              onClick={() => handleUpdate('processing')}
              disabled={isPending}
              className="w-full rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider gap-1.5"
            >
              <Check className="size-4" />
              Accept & Start Processing
            </Button>
            <Button
              onClick={() => handleUpdate('cancelled')}
              variant="outline"
              disabled={isPending}
              className="w-full rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
            >
              <XOctagon className="size-4" />
              Reject Order
            </Button>
          </div>
        )}

        {currentStatus === 'processing' && (
          <div className="space-y-4">
            {!showShipForm ? (
              <Button
                onClick={() => setShowShipForm(true)}
                className="w-full rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider gap-1.5"
              >
                <Truck className="size-4" />
                Dispatch & Mark Shipped
              </Button>
            ) : (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="tracking" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                    Logistics Tracking Number
                  </Label>
                  <Input
                    id="tracking"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. DHL-92841"
                    disabled={isPending}
                    className="rounded-none text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdate('shipped')}
                    disabled={!trackingNumber.trim() || isPending}
                    className="flex-1 rounded-none text-xs uppercase font-bold tracking-wider"
                  >
                    Fulfill Shipment
                  </Button>
                  <Button
                    onClick={() => setShowShipForm(false)}
                    variant="outline"
                    disabled={isPending}
                    className="rounded-none text-xs uppercase font-bold tracking-wider"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStatus === 'shipped' && (
          <Button
            onClick={() => handleUpdate('delivered')}
            disabled={isPending}
            className="w-full rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider gap-1.5"
          >
            <CheckSquare className="size-4" />
            Mark as Delivered
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
