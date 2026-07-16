import { describe, it, expect } from 'vitest'

interface CartItem {
  productId: string
  quantity: number
  price: number
}

function addToCart(cart: CartItem[], item: CartItem): CartItem[] {
  const existing = cart.find((i) => i.productId === item.productId)
  if (existing) {
    return cart.map((i) =>
      i.productId === item.productId
        ? { ...i, quantity: i.quantity + item.quantity }
        : i
    )
  }
  return [...cart, item]
}

describe('Cart Unit Logic', () => {
  it('should add a new product to an empty cart', () => {
    const cart: CartItem[] = []
    const item: CartItem = { productId: 'p1', quantity: 2, price: 1500 }
    
    const result = addToCart(cart, item)
    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(2)
  })

  it('should increment quantity if product already exists in cart', () => {
    const cart: CartItem[] = [{ productId: 'p1', quantity: 2, price: 1500 }]
    const item: CartItem = { productId: 'p1', quantity: 3, price: 1500 }

    const result = addToCart(cart, item)
    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(5)
  })
})
