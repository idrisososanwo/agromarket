'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'

export function UnauthorizedCard() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center p-6 min-h-[300px] select-none font-sans">
      <Card className="max-w-md w-full border border-red-200 dark:border-red-950/40 bg-card rounded-none shadow-md">
        <CardHeader className="p-6 border-b border-border text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full">
            <ShieldAlert className="size-8 stroke-[1.5]" />
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your current account credentials do not possess the authorization clearance required to view this interface.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Check Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
