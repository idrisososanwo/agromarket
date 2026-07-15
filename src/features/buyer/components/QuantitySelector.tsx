import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  maxStock: number
  disabled?: boolean
}

export function QuantitySelector({ value, onChange, maxStock, disabled }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1)
  }

  const handleIncrement = () => {
    if (value < maxStock) onChange(value + 1)
  }

  return (
    <div className="flex items-center border border-border h-8">
      <Button
        type="button"
        variant="ghost"
        onClick={handleDecrement}
        disabled={disabled || value <= 1}
        className="h-full px-2.5 rounded-none border-r border-border hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
      >
        <Minus className="size-3 text-muted-foreground" />
      </Button>

      <span className="w-10 text-center text-xs font-semibold text-foreground select-none">
        {value}
      </span>

      <Button
        type="button"
        variant="ghost"
        onClick={handleIncrement}
        disabled={disabled || value >= maxStock}
        className="h-full px-2.5 rounded-none border-l border-border hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
      >
        <Plus className="size-3 text-muted-foreground" />
      </Button>
    </div>
  )
}
