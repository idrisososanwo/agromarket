'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportReviewSchema, ReportReviewFormValues } from '../schemas'
import { useReportReview } from '../hooks/use-reviews'
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
import { Label } from '@/components/ui/label'
import { Flag } from 'lucide-react'

interface ReviewReportDialogProps {
  reviewId: string
}

export function ReviewReportDialog({ reviewId }: ReviewReportDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate: report, isPending } = useReportReview()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReportReviewFormValues>({
    resolver: zodResolver(reportReviewSchema),
    defaultValues: {
      reason: 'spam',
      notes: '',
    },
  })

  const onSubmit = (data: ReportReviewFormValues) => {
    report(
      { reviewId, reason: data.reason, notes: data.notes },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-red-500 cursor-pointer transition-colors"
      >
        <Flag className="size-3" />
        Report
      </DialogTrigger>
      <DialogContent className="rounded-none font-sans max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">
              Report Review
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Please specify why you are reporting this review. Abusive reviews violate platform terms.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="reason" className="text-[10px] font-bold uppercase tracking-wider">
                Reason
              </Label>
              <select
                id="reason"
                {...register('reason')}
                className="w-full h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="spam">Spam / Advertising</option>
                <option value="fake_review">Fake / Manipulated Review</option>
                <option value="offensive_content">Offensive / Abusive Language</option>
                <option value="irrelevant">Irrelevant / Off-topic</option>
                <option value="other">Other</option>
              </select>
              {errors.reason && (
                <p className="text-[10px] text-red-500">{errors.reason.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-wider">
                Additional Notes
              </Label>
              <textarea
                id="notes"
                {...register('notes')}
                placeholder="Describe the issue in detail..."
                className="w-full min-h-[80px] p-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              />
              {errors.notes && (
                <p className="text-[10px] text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer bg-red-600 hover:bg-red-500 text-white border-transparent"
            >
              Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
