import React from 'react'
import { Check, XCircle } from 'lucide-react'
import { OrderStatus } from '../types'

interface OrderTimelineProps {
  status: OrderStatus
  shippedAt?: string | null
  deliveredAt?: string | null
  cancelledAt?: string | null
  cancelledReason?: string | null
}

export function OrderTimeline({
  status,
  shippedAt,
  deliveredAt,
  cancelledAt,
  cancelledReason,
}: OrderTimelineProps) {
  const steps = [
    { label: 'Pending Payment', key: 'awaiting_payment' },
    { label: 'Confirmed', key: 'confirmed' },
    { label: 'Processing', key: 'processing' },
    { label: 'Shipped', key: 'shipped' },
    { label: 'Delivered', key: 'delivered' },
  ]

  const getStepIndex = (s: OrderStatus) => {
    if (s === 'cancelled') return -1
    if (s === 'awaiting_payment') return 0
    if (s === 'confirmed') return 1
    if (s === 'processing') return 2
    if (s === 'shipped') return 3
    if (s === 'delivered') return 4
    return 1
  }

  const currentStepIndex = getStepIndex(status)

  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 p-6 border border-red-100 dark:border-red-900/50 space-y-3">
        <div className="flex items-center gap-3">
          <XCircle className="size-8 text-red-500 shrink-0 stroke-[1.2]" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Order Cancelled</h4>
            {cancelledAt && (
              <span className="text-[10px] text-muted-foreground">
                Cancelled on {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(cancelledAt))}
              </span>
            )}
          </div>
        </div>
        {cancelledReason && (
          <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed font-sans pl-11">
            &ldquo;{cancelledReason}&rdquo;
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="border border-border bg-card p-6 rounded-none select-none">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Delivery Progress</h3>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border hidden md:block z-0" />
        
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex
          const isCurrent = idx === currentStepIndex

          return (
            <div key={step.key} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 flex-1 w-full md:text-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500'
                    : isCurrent
                    ? 'bg-white border-emerald-600 text-emerald-600 ring-2 ring-emerald-100 dark:bg-zinc-950 dark:border-emerald-500 dark:text-emerald-500 dark:ring-emerald-950'
                    : 'bg-white border-border text-muted-foreground dark:bg-zinc-950'
                }`}
              >
                {isCompleted ? <Check className="size-4 stroke-[2.5]" /> : idx + 1}
              </div>

              <div className="space-y-0.5">
                <span
                  className={`text-xs font-bold tracking-tight block ${
                    isCurrent
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-foreground'
                  }`}
                >
                  {step.label}
                </span>
                {step.key === 'shipped' && shippedAt && isCompleted && (
                  <span className="text-[9px] text-muted-foreground block md:mx-auto">
                    Shipped {new Date(shippedAt).toLocaleDateString()}
                  </span>
                )}
                {step.key === 'delivered' && deliveredAt && isCompleted && (
                  <span className="text-[9px] text-muted-foreground block md:mx-auto">
                    Delivered {new Date(deliveredAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
