'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Landmark, Milk, Cherry, Sprout, Nut, Wheat, LeafyGreen, Carrot } from 'lucide-react'

const CATEGORY_CARDS = [
  { name: 'Cassava', count: 120, icon: Sprout, gradient: 'from-amber-500/20 to-orange-500/20' },
  { name: 'Maize', count: 85, icon: Wheat, gradient: 'from-yellow-400/20 to-amber-500/20' },
  { name: 'Yam', count: 64, icon: Landmark, gradient: 'from-amber-700/20 to-yellow-600/20' },
  { name: 'Tomatoes', count: 48, icon: Carrot, gradient: 'from-red-500/20 to-rose-600/20' },
  { name: 'Cocoa', count: 32, icon: Nut, gradient: 'from-orange-800/20 to-amber-900/20' },
  { name: 'Vegetables', count: 96, icon: LeafyGreen, gradient: 'from-emerald-400/20 to-green-600/20' },
  { name: 'Fruits', count: 54, icon: Cherry, gradient: 'from-pink-500/20 to-rose-500/20' },
  { name: 'Livestock', count: 28, icon: Milk, gradient: 'from-blue-400/20 to-cyan-500/20' },
]

export function CategoryGrid() {
  return (
    <div className="space-y-4 font-sans select-none">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Browse Categories
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORY_CARDS.map((cat) => {
          const Icon = cat.icon
          return (
            <Link key={cat.name} href={`/categories/${cat.name.toLowerCase()}`}>
              <Card className="border border-border rounded-none bg-card shadow-none hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer overflow-hidden group">
                <CardContent className={`p-5 flex flex-col items-center justify-center text-center gap-3 bg-gradient-to-br ${cat.gradient}`}>
                  <div className="p-3 bg-background border border-border rounded-none group-hover:scale-110 transition-transform">
                    <Icon className="size-5 text-foreground stroke-[1.2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                      {cat.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">
                      {cat.count} listings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
