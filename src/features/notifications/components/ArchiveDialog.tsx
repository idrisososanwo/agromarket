'use client'

import React, { useState } from 'react'
import { useArchiveNotification } from '../hooks/use-notifications'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Archive } from 'lucide-react'

interface ArchiveDialogProps {
  notificationId: string
  trigger?: React.ReactNode
}

export function ArchiveDialog({ notificationId, trigger }: ArchiveDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate: archive, isPending } = useArchiveNotification()

  const handleArchive = () => {
    archive(
      { id: notificationId, archived: true },
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center gap-1.5 rounded-none border border-border bg-card px-3 py-1.5 text-[9px] uppercase font-bold tracking-wider cursor-pointer font-sans hover:bg-muted transition-colors"
      >
        <Archive className="size-3.5" />
        Archive
      </DialogTrigger>
      <DialogContent className="rounded-none font-sans max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold uppercase tracking-wider">
            Archive Notification
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            This notification will be moved to your archive. You can restore it at any time
            from the archive page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            disabled={isPending}
            className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Archive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
