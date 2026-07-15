'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Heart, User, Store } from 'lucide-react'

export function BuyerSidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/buyer/cart', label: 'Shopping Cart', icon: ShoppingCart },
    { href: '/buyer/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/buyer/profile', label: 'My Profile', icon: User },
    { href: '/marketplace', label: 'Public Market', icon: Store },
  ]

  return (
    <aside className="w-64 border-r border-border bg-zinc-50 dark:bg-zinc-900/10 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border select-none">
        <span className="font-heading font-bold text-base tracking-wider text-foreground">
          BUYER<span className="text-emerald-600 dark:text-emerald-500">PORTAL</span>
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/buyer/dashboard' && pathname.startsWith(link.href))
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors outline-none rounded-none focus-visible:ring-1 focus-visible:ring-ring ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                  : 'text-muted-foreground hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-900/50'
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
