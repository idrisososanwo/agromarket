import React from 'react'

interface CheckoutStepperProps {
  currentStep: 'delivery' | 'review'
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { id: 'cart', name: 'Shopping Cart', status: 'completed' },
    { id: 'delivery', name: 'Delivery Information', status: currentStep === 'review' ? 'completed' : 'active' },
    { id: 'review', name: 'Review Order', status: currentStep === 'review' ? 'active' : 'upcoming' },
  ]

  return (
    <div className="border-b border-border bg-white dark:bg-zinc-950 py-4 select-none">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <span className={`size-5 text-[10px] font-bold rounded-full flex items-center justify-center border ${
                step.status === 'completed'
                  ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500'
                  : step.status === 'active'
                  ? 'border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400 font-bold'
                  : 'border-zinc-300 text-muted-foreground'
              }`}>
                {idx + 1}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                step.status === 'completed' || step.status === 'active'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}>
                {step.name}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div className={`h-px flex-1 mx-4 ${
                step.status === 'completed'
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
