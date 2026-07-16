'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangeEmail } from '../hooks/use-profile-queries'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface EmailFormProps {
  currentEmail: string
}

export function EmailForm({ currentEmail }: EmailFormProps) {
  const { mutate: updateEmail, isPending } = useChangeEmail()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentEmail || '',
    },
  })

  const onSubmit = (data: EmailFormValues) => {
    updateEmail(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
            Update Email Address
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Account Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="e.g. name@example.com"
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.email && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block font-sans">
                {errors.email.message}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider"
        >
          {isPending ? 'Sending Link...' : 'Send Verification Link'}
        </Button>
      </div>
    </form>
  )
}
