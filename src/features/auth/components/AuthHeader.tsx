import React from 'react'

interface AuthHeaderProps {
  title: string
  description: string
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 text-center">
      <div className="flex justify-center mb-2 select-none">
        <span className="text-3xl font-bold tracking-wider font-heading text-foreground">
          AGRO<span className="text-emerald-600 dark:text-emerald-500">MARKET</span>
        </span>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight font-heading text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
