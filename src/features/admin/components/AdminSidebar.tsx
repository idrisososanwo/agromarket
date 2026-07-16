'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  FileText,
  CreditCard,
  AlertTriangle,
  BarChart3,
  Settings,
  ShieldCheck
} from 'lucide-react'

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Sellers Verification', href: '/admin/sellers', icon: UserCheck },
    { label: 'Products Moderation', href: '/admin/products', icon: ShoppingBag },
    { label: 'Orders Audit', href: '/admin/orders', icon: FileText },
    { label: 'Stellar Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Moderation Reports', href: '/admin/reports', icon: AlertTriangle },
    { label: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen shrink-0 font-sans hidden md:block select-none">
      <div className="p-6 border-b border-border flex items-center gap-2">
        <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-foreground">
          AgroMarket Admin
        </span>
      </div>
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-500 border-l-2 border-emerald-600'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <link.icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
