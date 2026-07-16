'use client'

import React from 'react'
import { OrderAdmin } from '../types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface OrdersTableProps {
  orders: OrderAdmin[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="rounded-none bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600 text-[9px] font-bold uppercase tracking-wide">Completed</Badge>
      case 'dispatched':
        return <Badge className="rounded-none bg-blue-600 text-[9px] font-bold uppercase tracking-wide">Dispatched</Badge>
      case 'processing':
        return <Badge className="rounded-none bg-indigo-600 text-[9px] font-bold uppercase tracking-wide">Processing</Badge>
      case 'cancelled':
        return <Badge variant="destructive" className="rounded-none text-[9px] font-bold uppercase tracking-wide">Cancelled</Badge>
      default:
        return <Badge className="rounded-none bg-amber-600 text-[9px] font-bold uppercase tracking-wide">Awaiting Payment</Badge>
    }
  }

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Order ID</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Buyer</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Total Amount</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Payment</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4 font-mono text-[10px] font-bold text-foreground">
                {o.id.substring(0, 8)}...
              </TableCell>
              <TableCell className="py-4">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {o.profiles?.full_name || 'AgroMarket Buyer'}
                  </span>
                  <span className="text-[9px] text-muted-foreground block">
                    {o.delivery_phone}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-xs font-bold text-foreground py-4">
                ${Number(o.total_amount).toFixed(2)}
              </TableCell>
              <TableCell className="py-4">
                <span className={`text-[10px] font-bold uppercase tracking-wide ${o.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {o.payment_status}
                </span>
              </TableCell>
              <TableCell className="py-4">
                {getStatusBadge(o.order_status)}
              </TableCell>
              <TableCell className="py-4 text-right">
                <Link href={`/orders/${o.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1 animate-none transition-none"
                  >
                    View Details
                    <ArrowRight className="size-3" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
