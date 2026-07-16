'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto px-4 py-20 select-none font-sans">
      <Card className="border border-red-200 dark:border-red-950/40 bg-card rounded-none shadow-md">
        <CardHeader className="p-6 border-b border-border text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full">
            <ShieldAlert className="size-10 stroke-[1.5]" />
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            403 - Forbidden Access
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            You do not have the required role privileges to access this URL. If you believe this is an error, please contact your administrator or check your account settings.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Back to Safety
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Check Credentials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
