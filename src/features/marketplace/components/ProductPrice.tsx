import React from 'react'

interface ProductPriceProps {
  price: number
  unit: string
  className?: string
}

export function ProductPrice({ price, unit, className = '' }: ProductPriceProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  return (
    <span className={`text-base font-bold text-emerald-600 dark:text-emerald-400 ${className}`}>
      {formattedPrice}
      <span className="text-xs font-normal text-muted-foreground ml-1">/ {unit}</span>
    </span>
  )
}
