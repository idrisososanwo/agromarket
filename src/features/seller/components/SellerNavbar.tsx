'use client'

import React from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLogout } from '@/features/auth/hooks/use-auth-mutations'

interface SellerNavbarProps {
  fullName?: string | null
  avatarUrl?: string | null
  email?: string | null
}

export function SellerNavbar({ fullName, avatarUrl, email }: SellerNavbarProps) {
  const { mutate: logoutMutate, isPending } = useLogout()

  const handleLogout = () => {
    logoutMutate()
  }

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'US'

  return (
    <header className="h-16 border-b border-border bg-white dark:bg-zinc-950 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground select-none">Welcome back,</span>
        <span className="text-xs font-semibold text-foreground">{fullName || email || 'Member'}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="size-8 rounded-none border border-border">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName || 'Avatar'} className="object-cover" />}
            <AvatarFallback className="rounded-none bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <Button
          variant="outline"
          size="xs"
          disabled={isPending}
          onClick={handleLogout}
          className="cursor-pointer gap-1.5 font-sans"
        >
          <LogOut className="size-3" />
          Logout
        </Button>
      </div>
    </header>
  )
}
