import React from 'react'
import { CartItem as CartItemType } from '../types'
import { CartItem } from './CartItem'

interface CartListProps {
  items: CartItemType[]
  onQuantityChange: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  isUpdating: boolean
}

export function CartList({ items, onQuantityChange, onRemoveItem, isUpdating }: CartListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={(qty) => onQuantityChange(item.id, qty)}
          onRemove={() => onRemoveItem(item.id)}
          isUpdating={isUpdating}
        />
      ))}
    </div>
  )
}
