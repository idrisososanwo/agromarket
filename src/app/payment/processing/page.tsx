'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyTransaction } from '@/features/payment/services/verifyTransaction'
import { createPayment } from '@/features/payment/services/createPayment'
import { updateOrderPayment } from '@/features/payment/services/updateOrderPayment'
import { createClient } from '@/lib/supabase/client'
import { PaymentStatusCard } from '@/features/payment/components/PaymentStatusCard'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function ProcessingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const txHash = searchParams.get('txHash') || ''
  const orderId = searchParams.get('orderId') || ''
  const amountXlm = parseFloat(searchParams.get('amountXlm') || '0')

  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  useEffect(() => {
    if (!txHash || !orderId || !amountXlm || !buyerId) return

    let isMounted = true

    const verifyAndRegister = async () => {
      try {
        const verification = await verifyTransaction(txHash, orderId, amountXlm)

        if (!isMounted) return

        if (!verification.isValid) {
          setErrorMsg(verification.error || 'Stellar validation failed.')
          await updateOrderPayment(orderId, 'failed')
          toast.error(verification.error || 'Payment verification failed.')
          router.push(`/payment/failed?orderId=${orderId}`)
          return
        }

        await createPayment(orderId, buyerId, txHash, verification.sourceAccount, amountXlm)
        await updateOrderPayment(orderId, 'paid', txHash)

        if (isMounted) {
          toast.success('Payment verified on-chain!')
          router.push(`/payment/success?orderId=${orderId}&txHash=${txHash}`)
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || 'System error occurred during verification.')
          router.push(`/payment/failed?orderId=${orderId}`)
        }
      }
    }

    const timer = setTimeout(() => {
      verifyAndRegister()
    }, 1500)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [txHash, orderId, amountXlm, buyerId, router])

  if (errorMsg) {
    return <PaymentStatusCard status="failed" message={errorMsg} />
  }

  return <PaymentStatusCard status="processing" />
}

export default function PaymentProcessingPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto space-y-4 text-center">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-6 w-3/4 mx-auto rounded-none" />
        </div>
      }>
        <ProcessingContent />
      </Suspense>
    </div>
  )
}
