'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/features/buyer/hooks/use-buyer-queries'
import { useCreateOrder } from '@/features/checkout/hooks/use-checkout-queries'
import { calculateOrderTotals } from '@/features/checkout/services/calculateOrderTotals'
import { CheckoutStepper } from '@/features/checkout/components/CheckoutStepper'
import { OrderItemsTable } from '@/features/checkout/components/OrderItemsTable'
import { OrderTotals } from '@/features/checkout/components/OrderTotals'
import { EmptyCheckoutState } from '@/features/checkout/components/EmptyCheckoutState'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, User, FileText, ArrowLeft } from 'lucide-react'
import { CheckoutDeliveryInfo } from '@/features/checkout/types'

export default function CheckoutReviewPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [buyerId, setBuyerId] = useState<string>('')
  const [deliveryInfo, setDeliveryInfo] = useState<CheckoutDeliveryInfo | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
      } else {
        router.push('/login')
      }
    })

    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('checkout_delivery_info')
      if (raw) {
        try {
          setDeliveryInfo(JSON.parse(raw))
        } catch (_) {
          router.push('/checkout')
        }
      } else {
        router.push('/checkout')
      }
    }
  }, [router, supabase])

  const { data: cartItems, isLoading: isCartLoading } = useCart(buyerId)
  const { mutate: placeOrder, isPending: isSubmitting } = useCreateOrder()

  const handleConfirmOrder = () => {
    if (!buyerId || !cartItems || !deliveryInfo) return

    placeOrder(
      {
        buyerId,
        cartItems,
        deliveryInfo,
      },
      {
        onSuccess: (orderId) => {
          sessionStorage.removeItem('checkout_delivery_info')
          router.push(`/checkout/success?orderId=${orderId}`)
        },
      }
    )
  }

  if (isCartLoading || !buyerId || !deliveryInfo) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full rounded-none" />
            <Skeleton className="h-48 w-full rounded-none" />
          </div>
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      </div>
    )
  }

  const hasItems = cartItems && cartItems.length > 0

  if (!hasItems) {
    return <EmptyCheckoutState />
  }

  const totals = calculateOrderTotals(cartItems)

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Review Your Order</h1>
        <p className="text-xs text-muted-foreground mt-1">Please double-check your order details and delivery info before placing your order.</p>
      </div>

      <CheckoutStepper currentStep="review" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border bg-card rounded-none">
            <CardHeader className="p-6 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
                Delivery Information
              </CardTitle>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => router.push('/checkout')}
                className="cursor-pointer gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-zinc-100 rounded-none border border-border px-2"
              >
                Edit Details
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-2.5 text-xs">
                <User className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block select-none">Recipient</span>
                  <span className="text-foreground font-semibold">{deliveryInfo.delivery_name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <Phone className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block select-none">Contact Phone</span>
                  <span className="text-foreground font-semibold">{deliveryInfo.delivery_phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block select-none">Delivery Address</span>
                  <span className="text-foreground font-semibold leading-relaxed">{deliveryInfo.delivery_address}</span>
                </div>
              </div>

              {deliveryInfo.notes && (
                <div className="flex items-start gap-2.5 text-xs border-t border-border pt-3">
                  <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider block select-none">Delivery Notes</span>
                    <span className="text-foreground italic leading-relaxed">{deliveryInfo.notes}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground select-none">Order Items</h3>
            <OrderItemsTable items={cartItems} />
          </div>

          <div className="flex justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/checkout')}
              className="cursor-pointer gap-1 rounded-none font-sans"
            >
              <ArrowLeft className="size-3.5" />
              Back to Delivery Details
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderTotals
            totals={totals}
            onAction={handleConfirmOrder}
            actionLabel="Confirm and Place Order"
            isPending={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
