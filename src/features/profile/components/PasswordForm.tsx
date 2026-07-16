'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChangePassword } from '../hooks/use-profile-queries'

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordForm() {
  const { mutate: updatePassword, isPending } = useChangePassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: PasswordFormValues) => {
    updatePassword(data.password, {
      onSuccess: () => {
        reset()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pass" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              New Password
            </Label>
            <Input
              id="pass"
              type="password"
              {...register('password')}
              placeholder="Min 6 characters..."
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.password && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block font-sans">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Confirm New Password
            </Label>
            <Input
              id="confirm"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm password..."
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.confirmPassword && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block font-sans">
                {errors.confirmPassword.message}
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
          {isPending ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  )
}
