import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ContinueShoppingButton() {
  return (
    <Link
      href="/marketplace"
      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'cursor-pointer font-sans gap-1.5')}
    >
      <ArrowLeft className="size-3.5" />
      Continue Shopping
    </Link>
  )
}
