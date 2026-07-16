import React from 'react'
import { CartItem } from '@/features/buyer/types'
import { ProductImage } from '@/features/marketplace/components/ProductImage'
import { ProductPrice } from '@/features/marketplace/components/ProductPrice'

interface OrderItemsTableProps {
  items: CartItem[]
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
  return (
    <div className="border border-border bg-card divide-y divide-border">
      {items.map((item) => {
        const product = item.products
        const price = product?.price || 0
        const subtotal = price * item.quantity

        return (
          <div key={item.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-12 border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                <ProductImage
                  src={product?.image_url || null}
                  title={product?.title || 'Produce'}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {product?.title || 'Unknown Product'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {item.quantity} {product?.unit || 'unit'}(s) • <ProductPrice price={price} unit={product?.unit || 'unit'} className="text-xs text-muted-foreground font-medium" />
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-foreground">
                ${subtotal.toFixed(2)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
