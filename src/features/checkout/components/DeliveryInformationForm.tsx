import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutFormSchema, CheckoutFormValues } from '../schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Phone, User, FileText } from 'lucide-react'

interface DeliveryInformationFormProps {
  onSubmit: (data: CheckoutFormValues) => void
  defaultValues?: CheckoutFormValues
  isPending?: boolean
}

export function DeliveryInformationForm({ onSubmit, defaultValues, isPending }: DeliveryInformationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: defaultValues || {
      delivery_name: '',
      delivery_phone: '',
      delivery_address: '',
      notes: '',
    },
  })

  return (
    <Card className="border border-border bg-card rounded-none">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Delivery Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="delivery_name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
              <User className="size-3.5 text-zinc-500" />
              Recipient Full Name
            </Label>
            <Input
              id="delivery_name"
              placeholder="e.g. John Doe"
              {...register('delivery_name')}
              disabled={isPending}
              className="rounded-none bg-zinc-50/30 font-sans focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500"
            />
            {errors.delivery_name && (
              <p className="text-[10px] text-red-500 font-semibold">{errors.delivery_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
              <Phone className="size-3.5 text-zinc-500" />
              Recipient Phone Number
            </Label>
            <Input
              id="delivery_phone"
              placeholder="e.g. +1234567890"
              {...register('delivery_phone')}
              disabled={isPending}
              className="rounded-none bg-zinc-50/30 font-sans focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500"
            />
            {errors.delivery_phone && (
              <p className="text-[10px] text-red-500 font-semibold">{errors.delivery_phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
              <MapPin className="size-3.5 text-zinc-500" />
              Full Delivery Address
            </Label>
            <textarea
              id="delivery_address"
              placeholder="e.g. 123 Farm Road, Sector 4, Greenfield State"
              rows={3}
              {...register('delivery_address')}
              disabled={isPending}
              className="w-full min-w-0 border border-transparent border-b-input bg-transparent px-0 py-1 text-base transition-[color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-b-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[80px] font-sans focus-visible:ring-0"
            />
            {errors.delivery_address && (
              <p className="text-[10px] text-red-500 font-semibold">{errors.delivery_address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 select-none">
              <FileText className="size-3.5 text-zinc-500" />
              Additional Delivery Instructions (Optional)
            </Label>
            <textarea
              id="notes"
              placeholder="e.g. Leave near the side entrance gate."
              rows={2}
              {...register('notes')}
              disabled={isPending}
              className="w-full min-w-0 border border-transparent border-b-input bg-transparent px-0 py-1 text-base transition-[color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-b-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[60px] font-sans focus-visible:ring-0"
            />
            {errors.notes && (
              <p className="text-[10px] text-red-500 font-semibold">{errors.notes.message}</p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer px-6 rounded-none font-sans uppercase tracking-wider text-xs font-bold"
            >
              Continue to Order Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
