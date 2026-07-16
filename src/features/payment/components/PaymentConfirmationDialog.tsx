import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

interface PaymentConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amountXlm: number
  isPending?: boolean
}

export function PaymentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  amountXlm,
  isPending,
}: PaymentConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950 p-6 border border-border rounded-none select-none">
        <DialogHeader className="space-y-2">
          <div className="flex justify-start mb-2">
            <ShieldCheck className="size-10 text-emerald-600 dark:text-emerald-500" />
          </div>
          <DialogTitle className="text-lg font-semibold tracking-wide uppercase font-heading text-foreground">
            Confirm Payment Submission
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            You are about to sign and broadcast a native payment of <strong>{amountXlm.toFixed(2)} XLM</strong> to the platform escrow. This transaction will execute on the live Stellar Testnet network.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer font-sans"
          >
            {isPending ? 'Signing & Submitting...' : 'Confirm & Pay'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
