'use client'

import React from 'react'
import { useMarkAllAsRead } from '../hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { CheckCheck } from 'lucide-react'

interface MarkAllReadButtonProps {
  disabled?: boolean
}

export function MarkAllReadButton({ disabled }: MarkAllReadButtonProps) {
  const { mutate, isPending } = useMarkAllAsRead()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => mutate()}
      disabled={disabled || isPending}
      className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1.5 font-sans"
    >
      <CheckCheck className="size-3.5" />
      Mark All Read
    </Button>
  )
}
