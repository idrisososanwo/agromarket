'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUpdateProfile } from '../hooks/use-profile-queries'
import { UserProfile } from '../types'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(5, 'Phone number must be at least 5 digits').or(z.literal('')),
  bio: z.string().max(250, 'Bio must be under 250 characters').or(z.literal('')),
  address: z.string().min(5, 'Address must be at least 5 characters').or(z.literal('')),
  city: z.string().min(2, 'City must be at least 2 characters').or(z.literal('')),
  state: z.string().min(2, 'State must be at least 2 characters').or(z.literal('')),
  country: z.string().min(2, 'Country must be at least 2 characters').or(z.literal('')),
  postal_code: z.string().min(3, 'Postal code must be at least 3 characters').or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface EditProfileFormProps {
  profile: UserProfile
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      country: profile.country || '',
      postal_code: profile.postal_code || '',
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile({
      userId: profile.id,
      updates: data,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Full Name
            </Label>
            <Input
              id="full_name"
              {...register('full_name')}
              placeholder="e.g. Jane Doe"
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.full_name && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                {errors.full_name.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Phone Number
            </Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="e.g. +123456789"
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.phone && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Short Bio
            </Label>
            <textarea
              id="bio"
              {...register('bio')}
              placeholder="Write a brief profile description..."
              className="flex w-full border border-border bg-card p-3 rounded-none text-xs min-h-[80px] focus-visible:ring-emerald-600 focus-visible:ring-2 outline-none font-sans"
              disabled={isPending}
            />
            {errors.bio && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                {errors.bio.message}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border bg-card rounded-none">
        <CardHeader className="p-6 border-b border-border">
          <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
            Contact Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
              Street Address
            </Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="e.g. 123 Farm Road"
              className="rounded-none text-xs"
              disabled={isPending}
            />
            {errors.address && (
              <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                City
              </Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="e.g. Springfield"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.city && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                State / Region
              </Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="e.g. IL"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.state && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.state.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Country
              </Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="e.g. US"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.country && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.country.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postal_code" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Postal Code
              </Label>
              <Input
                id="postal_code"
                {...register('postal_code')}
                placeholder="e.g. 62701"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.postal_code && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.postal_code.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider"
        >
          {isPending ? 'Saving...' : 'Save Profile Changes'}
        </Button>
      </div>
    </form>
  )
}
