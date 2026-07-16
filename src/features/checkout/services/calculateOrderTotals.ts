import { CartItem } from '@/features/buyer/types'
import { CheckoutTotals } from '../types'

export function calculateOrderTotals(cartItems: CartItem[]): CheckoutTotals {
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.products?.price || 0
    return acc + price * item.quantity
  }, 0)

  const deliveryFee = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const total = subtotal + deliveryFee + tax

  return {
    subtotal,
    deliveryFee,
    tax,
    total,
  }
}
