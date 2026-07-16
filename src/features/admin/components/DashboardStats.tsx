'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardStatsAdmin } from '../types'
import { Users, ShoppingBag, DollarSign, HelpCircle, FileText } from 'lucide-react'

interface DashboardStatsProps {
  stats: DashboardStatsAdmin
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, desc: `${stats.totalBuyers} Buyers / ${stats.totalSellers} Sellers`, icon: Users, color: 'text-blue-500' },
    { label: 'Total Products', value: stats.totalProducts, desc: `${stats.activeListings} Active Listings`, icon: ShoppingBag, color: 'text-emerald-500' },
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, desc: 'Completed USD Payments', icon: DollarSign, color: 'text-amber-500' },
    { label: 'Awaiting Verification', value: stats.pendingSellerVerifications, desc: 'Seller profiles pending audit', icon: HelpCircle, color: 'text-amber-600' },
    { label: 'Orders Today', value: stats.ordersToday, desc: `${stats.pendingPayments} payments pending`, icon: FileText, color: 'text-indigo-500' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-sans select-none">
      {cards.map((card) => (
        <Card key={card.label} className="border border-border bg-card rounded-none">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {card.label}
              </span>
              <card.icon className={`size-5 ${card.color} stroke-[1.5]`} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xl font-bold text-foreground tracking-tight">{card.value}</p>
              <span className="text-[10px] text-muted-foreground block">{card.desc}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
