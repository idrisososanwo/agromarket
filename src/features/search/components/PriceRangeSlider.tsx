'use client'

import React from 'react'
import { Label } from '@/components/ui/label'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (val: [number, number]) => void
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  // A responsive, premium text input selector for exact pricing controls
  return (
    <div className="space-y-2 font-sans select-none text-xs">
      <div className="flex justify-between items-center">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Price Bounds</Label>
        <span className="text-[10px] text-muted-foreground font-mono">
          ₦{value[0]} - ₦{value[1]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
          className="w-full accent-primary cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </div>
  )
}
