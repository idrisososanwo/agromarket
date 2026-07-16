'use client'

import React from 'react'

interface FilterOption {
  label: string
  value: string
}

interface FilterPanelProps {
  value: string
  onChange: (val: string) => void
  options: FilterOption[]
  label?: string
}

export function FilterPanel({ value, onChange, options, label }: FilterPanelProps) {
  return (
    <div className="flex items-center gap-2 font-sans select-none">
      {label && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          {label}:
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-card text-[10px] uppercase font-bold tracking-wider rounded-none p-2 focus-visible:ring-emerald-600 focus-visible:ring-1 outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
