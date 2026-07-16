'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOrderDetails } from '@/features/checkout/hooks/use-checkout-queries'
import { PaymentSummary } from '@/features/payment/components/PaymentSummary'
import { WalletInformationCard } from '@/features/payment/components/WalletInformationCard'
import { PaymentConfirmationDialog } from '@/features/payment/components/PaymentConfirmationDialog'
import { buildTransaction } from '@/features/payment/services/buildTransaction'
import { useSubmitPayment } from '@/features/payment/hooks/use-payment-queries'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function PaymentFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')
  
  const [walletPublicKey, setWalletPublicKey] = useState('')
  const [walletSecretKey, setWalletSecretKey] = useState('')
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isBuildingTx, setIsBuildingTx] = useState(false)
  const [builtXdr, setBuiltXdr] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setBuyerId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: order, isLoading: isOrderLoading } = useOrderDetails(orderId)
  const { mutate: submitPayment, isPending: isSubmitting } = useSubmitPayment()

  if (isOrderLoading || !buyerId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-none" />
          <Skeleton className="h-64 w-full rounded-none" />
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

  if (order.payment_status === 'paid') {
    return (
      <div className="text-center py-20 select-none">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-500">Order Already Paid</h3>
        <p className="text-xs text-muted-foreground mt-1">This order has already been successfully processed on the Stellar blockchain.</p>
        <Button
          onClick={() => router.push('/buyer/dashboard')}
          className="mt-6 cursor-pointer font-sans text-xs uppercase font-bold tracking-wider rounded-none"
        >
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const amountXlm = Number(order.total_amount) * 10

  const handleWalletConfigured = (pubKey: string, secKey: string) => {
    setWalletPublicKey(pubKey)
    setWalletSecretKey(secKey)
  }

  const handleInitiatePayment = async () => {
    if (!walletPublicKey || !walletSecretKey) {
      toast.error('Please configure your Stellar Testnet wallet keys first.')
      return
    }

    setIsBuildingTx(true)
    try {
      const xdr = await buildTransaction(walletPublicKey, amountXlm, order.id)
      setBuiltXdr(xdr)
      setIsConfirmOpen(true)
    } catch (error: any) {
      toast.error(error.message || 'Failed to build transaction payload.')
    } finally {
      setIsBuildingTx(false)
    }
  }

  const handleConfirmPayment = () => {
    if (!builtXdr || !walletSecretKey) return

    submitPayment(
      {
        xdr: builtXdr,
        secretKey: walletSecretKey,
        publicKey: walletPublicKey,
        orderId: order.id,
        buyerId,
        amountXlm,
      },
      {
        onSuccess: (txHash) => {
          setIsConfirmOpen(false)
          router.push(`/payment/processing?txHash=${txHash}&orderId=${order.id}&amountXlm=${amountXlm}`)
        },
      }
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Stellar XLM Payment</h1>
        <p className="text-xs text-muted-foreground mt-1">Complete your transaction using Testnet XLM. We will verify the transaction on the ledger.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <PaymentSummary
            orderId={order.id}
            subtotal={order.subtotal}
            deliveryFee={order.delivery_fee}
            totalAmount={order.total_amount}
          />
        </div>

        <div className="space-y-6">
          <WalletInformationCard
            onWalletLoaded={handleWalletConfigured}
            amountNeeded={amountXlm}
          />

          <div className="pt-2">
            <Button
              onClick={handleInitiatePayment}
              disabled={!walletPublicKey || !walletSecretKey || isBuildingTx || isSubmitting}
              className="w-full cursor-pointer rounded-none text-xs uppercase font-bold tracking-wider py-6"
            >
              {isBuildingTx ? 'Building Blockchain XDR...' : 'Pay with XLM Wallet'}
            </Button>
          </div>
        </div>
      </div>

      <PaymentConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPayment}
        amountXlm={amountXlm}
        isPending={isSubmitting}
      />
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full rounded-none" />
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      </div>
    }>
      <PaymentFormContent />
    </Suspense>
  )
}
