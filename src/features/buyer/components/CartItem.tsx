import React from 'react'
import { Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '../types'
import { QuantitySelector } from './QuantitySelector'
import { ProductImage } from '@/features/marketplace/components/ProductImage'
import { ProductPrice } from '@/features/marketplace/components/ProductPrice'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
  isUpdating: boolean
}

export function CartItem({ item, onQuantityChange, onRemove, isUpdating }: CartItemProps) {
  const product = item.products
  const price = product?.price || 0
  const subtotal = price * item.quantity

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border bg-card">
      {/* Left side: details */}
      <div className="flex items-center gap-4">
        <div className="size-16 border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
          <ProductImage
            src={product?.image_url || null}
            title={product?.title || 'Produce'}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{product?.title || 'Unknown Product'}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Unit: {product?.unit || 'kg'} • <ProductPrice price={price} unit={product?.unit || 'kg'} className="text-xs text-muted-foreground font-medium" />
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
            In stock: {product?.quantity || 0} {product?.unit}s
          </p>
        </div>
      </div>

      {/* Right side: quantity controls & totals */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-border pt-3 sm:pt-0">
        <QuantitySelector
          value={item.quantity}
          onChange={onQuantityChange}
          maxStock={product?.quantity || 1}
          disabled={isUpdating}
        />

        <div className="text-right min-w-[75px]">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Subtotal</p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            ${subtotal.toFixed(2)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          disabled={isUpdating}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 size-8 cursor-pointer"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  )
}
