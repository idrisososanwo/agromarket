'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { loginSchema } from '../schemas'
import { LoginInput } from '../types'
import { useLogin } from '../hooks/use-auth-mutations'
import { AuthHeader } from './AuthHeader'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: loginMutate, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginInput) => {
    loginMutate(data)
  }

  return (
    <div className="space-y-6">
      <AuthHeader
        title="Welcome Back"
        description="Sign in to your AgroMarket account to continue trading"
      />

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 focus-visible:underline outline-none"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={isPending}
              placeholder="••••••••"
              className="pr-10"
              {...register('password')}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground focus-visible:text-foreground outline-none cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isPending} className="w-full mt-2 cursor-pointer">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-500 dark:hover:text-emerald-400 focus-visible:underline outline-none"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
