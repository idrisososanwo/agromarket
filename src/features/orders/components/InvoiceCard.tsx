'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, Coins, ExternalLink } from 'lucide-react'
import { OrderDetails } from '../types'
import { OrderStatusBadge } from './OrderStatusBadge'

interface InvoiceCardProps {
  order: OrderDetails
}

export function InvoiceCard({ order }: InvoiceCardProps) {
  const handlePrint = () => {
    window.print()
  }

  const payment = order.payments?.[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order Invoice</h3>
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <Printer className="size-4" />
          Print Invoice
        </Button>
      </div>

      <Card className="border border-border bg-white dark:bg-zinc-950 rounded-none p-8 font-sans print:border-none print:shadow-none">
        <CardContent className="p-0 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
            <div>
              <span className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-500 font-heading">AGROMARKET</span>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Decentralized Agriculture Marketplace</p>
            </div>
            <div className="text-right sm:text-right flex flex-col items-end">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Invoice / Receipt</span>
              <code className="text-xs font-bold font-mono text-foreground mt-1 select-all">{order.id}</code>
              <span className="text-[10px] text-muted-foreground mt-1">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Billed To (Buyer)</h4>
              <p className="text-xs font-bold text-foreground">{order.delivery_name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{order.delivery_phone}</p>
              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                {order.delivery_address}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end md:text-right">
              <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Fulfillment Status</h4>
              <div className="mb-2">
                <OrderStatusBadge status={order.order_status} />
              </div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-2 block">Payment Status</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mt-1">
                {order.payment_status}
              </span>
            </div>
          </div>

          <div className="border-t border-b border-border py-4">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border pb-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  <th className="py-2">Item Details</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.order_items.map((item) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-3 font-semibold text-foreground">
                      {item.products?.title || 'Unknown Product'}
                      {item.products?.unit && (
                        <span className="text-[10px] text-muted-foreground font-normal ml-1">
                          per {item.products.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-muted-foreground">${Number(item.unit_price).toFixed(2)}</td>
                    <td className="py-3 text-right font-semibold text-foreground">${Number(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery Fee</span>
                <span>${Number(order.delivery_fee).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border pt-3">
                <span className="text-sm font-bold text-foreground uppercase tracking-wider">Total</span>
                <span className="text-lg font-black text-foreground">${Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {payment && (
            <div className="border border-border p-4 bg-zinc-50 dark:bg-zinc-900/50 space-y-3 font-sans">
              <div className="flex justify-between items-baseline">
                <h5 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5 select-none">
                  <Coins className="size-4 text-emerald-600 dark:text-emerald-500" />
                  Stellar Payment Details
                </h5>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 select-none">
                  Testnet Transaction Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block select-none">Sender Wallet Account</span>
                  <code className="text-[10px] font-mono font-bold text-foreground break-all select-all">{payment.stellar_account}</code>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block select-none">Amount Transferred</span>
                  <span className="font-bold text-foreground">{payment.amount_xlm.toFixed(2)} XLM</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block select-none">Transaction Hash</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <code className="text-[10px] font-mono font-bold text-foreground break-all select-all flex-1">{payment.transaction_hash}</code>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${payment.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-0.5"
                  >
                    Explorer
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
