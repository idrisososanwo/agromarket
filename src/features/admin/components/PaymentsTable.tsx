'use client'

import React from 'react'
import { PaymentAdmin } from '../types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

interface PaymentsTableProps {
  payments: PaymentAdmin[]
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const getExplorerLink = (txHash: string) => {
    return `https://stellar.expert/explorer/testnet/tx/${txHash}`
  }

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Transaction Hash</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Buyer</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Amount (XLM)</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Network</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4">
                <a
                  href={getExplorerLink(p.transaction_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {p.transaction_hash.substring(0, 12)}...
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              </TableCell>
              <TableCell className="text-xs font-bold text-foreground py-4">
                {p.profiles?.full_name || 'AgroMarket Buyer'}
              </TableCell>
              <TableCell className="text-xs font-bold text-foreground py-4">
                {Number(p.amount_xlm).toFixed(2)} XLM
              </TableCell>
              <TableCell className="py-4 text-xs uppercase text-muted-foreground">
                {p.network}
              </TableCell>
              <TableCell className="py-4">
                {p.payment_status === 'paid' || p.payment_status === 'completed' ? (
                  <Badge className="rounded-none bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600 text-[9px] font-bold uppercase tracking-wide">
                    Paid
                  </Badge>
                ) : (
                  <Badge className="rounded-none bg-amber-600 text-[9px] font-bold uppercase tracking-wide">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground py-4 text-right">
                {new Date(p.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
