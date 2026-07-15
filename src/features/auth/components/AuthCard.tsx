import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface AuthCardProps {
  children: React.ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md transition-all duration-300 hover:shadow-2xl">
      <Card className="border border-border bg-card/60 shadow-xl backdrop-blur-xl dark:bg-card/40">
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
