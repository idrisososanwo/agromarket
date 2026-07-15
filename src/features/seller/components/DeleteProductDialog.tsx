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
import { Loader2 } from 'lucide-react'

interface DeleteProductDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  productTitle: string
}

export function DeleteProductDialog({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  productTitle,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-md bg-white dark:bg-zinc-950 p-6 border border-border rounded-none">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold tracking-wide uppercase font-heading text-destructive">
            Delete Product
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete <strong className="text-foreground">"{productTitle}"</strong>?
            This action is permanent and cannot be undone. The product listing and its image will be removed.
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
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Listing'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
