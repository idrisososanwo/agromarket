import React from 'react'
import { BuyerOrder } from '../types'
import { ProductImage } from '@/features/marketplace/components/ProductImage'
import { Calendar } from 'lucide-react'

interface OrderPreviewCardProps {
  order: BuyerOrder
}

export function OrderPreviewCard({ order }: OrderPreviewCardProps) {
  const date = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(order.created_at))

  return (
    <div className="py-4 flex items-center justify-between first:pt-2 last:pb-2">
      <div className="flex items-center gap-3">
        <div className="size-12 border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
          <ProductImage
            src={order.products?.image_url || null}
            title={order.products?.title || 'Produce'}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-foreground">
            {order.products?.title || 'Unknown Product'}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Calendar className="size-3" />
              {date}
            </span>
            <span>•</span>
            <span>Qty: {order.quantity}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-foreground">
          ${Number(order.total_price).toFixed(2)}
        </p>
        <span className={`text-[10px] font-bold tracking-wider uppercase ${
          order.status === 'completed'
            ? 'text-emerald-600 dark:text-emerald-400'
            : order.status === 'pending'
            ? 'text-amber-600'
            : 'text-red-500'
        }`}>
          {order.status}
        </span>
      </div>
    </div>
  )
}
