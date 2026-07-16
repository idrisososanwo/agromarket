'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto px-4 py-20 select-none font-sans">
      <Card className="border border-border bg-card rounded-none shadow-md">
        <CardHeader className="p-6 border-b border-border text-center flex flex-col items-center gap-3">
          <div className="p-3 bg-muted text-muted-foreground rounded-full border border-border">
            <ShieldCheck className="size-10 stroke-[1.2]" />
          </div>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
            Session Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your login session has expired or requires authentication. Please sign in to verify your identity and restore access to your account assets.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => router.push('/login')}
              className="rounded-none cursor-pointer text-[10px] uppercase font-bold tracking-wider"
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
