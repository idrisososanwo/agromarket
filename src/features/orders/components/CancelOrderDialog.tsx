'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'

interface CancelOrderDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isPending?: boolean
}

export function CancelOrderDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: CancelOrderDialogProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onConfirm(reason)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950 p-6 border border-border rounded-none select-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader className="space-y-2">
            <div className="flex justify-start mb-2">
              <AlertTriangle className="size-10 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-semibold tracking-wide uppercase font-heading text-foreground">
              Cancel Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to cancel this order? This action will restore item stock levels in our system. Please provide a brief reason for the cancellation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="reason" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Cancellation Reason
            </Label>
            <Input
              id="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Changed my mind / Ordered wrong product quantity"
              disabled={isPending}
              className="rounded-none text-xs focus-visible:ring-red-500"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason.trim() || isPending}
              className="cursor-pointer font-sans"
            >
              {isPending ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
