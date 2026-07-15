'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { forgotPasswordSchema } from '../schemas'
import { ForgotPasswordInput } from '../types'
import { useForgotPassword } from '../hooks/use-auth-mutations'
import { AuthHeader } from './AuthHeader'

export function ForgotPasswordForm() {
  const { mutate: forgotPasswordMutate, isPending, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPasswordMutate(data)
  }

  return (
    <div className="space-y-6">
      <AuthHeader
        title="Reset Password"
        description="Enter your email address and we'll send you a recovery link"
      />

      {isSuccess ? (
        <div className="rounded-none bg-emerald-50/50 p-4 text-center border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50">
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            A password reset email has been sent. Please check your inbox and click the recovery link.
          </p>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 focus-visible:underline outline-none"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isPending}
              placeholder="name@example.com"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full mt-2 cursor-pointer">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Link...
              </>
            ) : (
              'Send Recovery Link'
            )}
          </Button>
        </form>
      )}

      {!isSuccess && (
        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 focus-visible:underline outline-none"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  )
}
