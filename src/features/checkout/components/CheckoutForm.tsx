'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/features/buyer/hooks/use-buyer-queries'
import { CheckoutStepper } from './CheckoutStepper'
import { DeliveryInformationForm } from './DeliveryInformationForm'
import { EmptyCheckoutState } from './EmptyCheckoutState'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckoutFormValues } from '../schemas'

export function CheckoutForm() {
  const router = useRouter()
  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: cartItems, isLoading } = useCart(buyerId)

  const handleSubmitDelivery = (data: CheckoutFormValues) => {
    sessionStorage.setItem('checkout_delivery_info', JSON.stringify(data))
    router.push('/checkout/review')
  }

  if (isLoading || !buyerId) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/3 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  const hasItems = cartItems && cartItems.length > 0

  if (!hasItems) {
    return <EmptyCheckoutState />
  }

  let savedValues: CheckoutFormValues | undefined = undefined
  if (typeof window !== 'undefined') {
    const raw = sessionStorage.getItem('checkout_delivery_info')
    if (raw) {
      try {
        savedValues = JSON.parse(raw)
      } catch (_) {}
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Checkout</h1>
        <p className="text-xs text-muted-foreground mt-1">Provide your delivery information to proceed with ordering.</p>
      </div>

      <CheckoutStepper currentStep="delivery" />

      <DeliveryInformationForm
        onSubmit={handleSubmitDelivery}
        defaultValues={savedValues}
      />
    </div>
  )
}
