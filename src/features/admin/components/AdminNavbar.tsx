'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/features/auth/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Home } from 'lucide-react'
import { toast } from 'sonner'

export function AdminNavbar() {
  const router = useRouter()
  const user = useUser()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message || 'Logout failed')
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between font-sans select-none shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:block">
          Control Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none text-[10px] uppercase font-bold tracking-wider gap-1.5 cursor-pointer"
          >
            <Home className="size-3.5" />
            Marketplace
          </Button>
        </Link>

        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-none text-[10px] uppercase font-bold tracking-wider gap-1.5 cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut className="size-3.5" />
            Sign Out
          </Button>
        )}
      </div>
    </header>
  )
}
