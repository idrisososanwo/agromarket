import React from 'react'

interface MarketplaceHeaderProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function MarketplaceHeader({
  title = 'Agricultural Marketplace',
  description = 'Browse and trade fresh local farm produce direct from growers',
  children,
}: MarketplaceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-heading text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
