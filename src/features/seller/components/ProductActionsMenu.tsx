import React from 'react'
import Link from 'next/link'
import { MoreHorizontal, Edit, Trash, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductActionsMenuProps {
  productId: string
  onDeleteClick: () => void
}

export function ProductActionsMenu({ productId, onDeleteClick }: ProductActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-pointer')}>
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open actions menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-white dark:bg-zinc-950 border border-border rounded-none p-1">
        <DropdownMenuItem className="p-0">
          <Link
            href={`/marketplace/${productId}`}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium tracking-wider uppercase text-foreground outline-none"
          >
            <Eye className="size-3.5" />
            View Detail
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Link
            href={`/seller/products/${productId}/edit`}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium tracking-wider uppercase text-foreground outline-none"
          >
            <Edit className="size-3.5" />
            Edit Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDeleteClick}
          className="cursor-pointer text-xs text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 rounded-none p-2 flex items-center gap-2"
        >
          <Trash className="size-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
