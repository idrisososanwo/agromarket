'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface TransactionDetailsProps {
  txHash: string
  amountXlm?: number
  network?: string
  createdAt?: string
}

export function TransactionDetails({ txHash, amountXlm, network = 'testnet', createdAt }: TransactionDetailsProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    toast.success('Transaction hash copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${txHash}`

  return (
    <Card className="border border-border bg-card rounded-none select-none max-w-xl">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Stellar Transaction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Transaction Hash</span>
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono font-bold text-foreground bg-zinc-50 dark:bg-zinc-900/50 p-2 border border-border block break-all flex-1 select-all">
              {txHash}
            </code>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={handleCopy}
              className="size-9 shrink-0 cursor-pointer rounded-none border border-border"
            >
              {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Network</span>
            <p className="text-xs font-semibold text-foreground uppercase mt-0.5">{network}</p>
          </div>
          {amountXlm !== undefined && (
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Amount Transferred</span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{amountXlm.toFixed(2)} XLM</p>
            </div>
          )}
        </div>

        {createdAt && (
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Timestamp</span>
            <p className="text-xs font-semibold text-foreground mt-0.5">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(createdAt))}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-border flex justify-end">
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-500 hover:underline select-none"
          >
            View on Stellar Expert
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
