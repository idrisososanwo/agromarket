'use client'

import React, { use, useState, useEffect } from 'react'
import { getTransaction } from '@/features/payment/services/getTransaction'
import { TransactionDetails } from '@/features/payment/components/TransactionDetails'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function TransactionPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const txHash = resolvedParams.id

  const [txData, setTxData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!txHash) return

    getTransaction(txHash)
      .then((data) => {
        setTxData(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load transaction details from Stellar Horizon.')
        setIsLoading(false)
      })
  }, [txHash])

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 space-y-4">
        <Skeleton className="h-6 w-1/3 rounded-none" />
        <Skeleton className="h-48 w-full rounded-none" />
      </div>
    )
  }

  if (error || !txData) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center select-none space-y-4">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Transaction Lookup Error</h3>
        <p className="text-xs text-muted-foreground">{error || 'Transaction could not be fetched from Testnet Horizon.'}</p>
        <Button
          onClick={() => router.push('/buyer/dashboard')}
          className="cursor-pointer font-sans text-xs uppercase font-bold tracking-wider rounded-none"
        >
          Return to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-4 space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Stellar Receipt</h1>
        <p className="text-xs text-muted-foreground mt-1">This transaction is registered on the public Stellar Testnet ledger.</p>
      </div>

      <TransactionDetails
        txHash={txData.hash}
        createdAt={txData.created_at}
        network="Testnet"
      />
    </div>
  )
}
