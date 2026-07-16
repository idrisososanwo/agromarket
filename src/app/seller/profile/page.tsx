'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSellerProfile, useUpdateSellerProfile } from '@/features/profile/hooks/use-profile-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

const sellerProfileSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  farm_name: z.string().min(2, 'Farm name must be at least 2 characters'),
  business_description: z.string().max(500, 'Description must be under 500 characters').or(z.literal('')),
  years_of_experience: z.number().min(0, 'Years of experience cannot be negative'),
})

type SellerProfileFormValues = z.infer<typeof sellerProfileSchema>

export default function SellerProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setSellerId(user.id)
      } else {
        router.push('/login')
      }
    })
  }, [router, supabase])

  const { data: sellerProfile, isLoading } = useSellerProfile(sellerId)
  const { mutate: updateSeller, isPending } = useUpdateSellerProfile()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SellerProfileFormValues>({
    resolver: zodResolver(sellerProfileSchema),
    defaultValues: {
      business_name: '',
      farm_name: '',
      business_description: '',
      years_of_experience: 0,
    },
  })

  useEffect(() => {
    if (sellerProfile) {
      setValue('business_name', sellerProfile.business_name || '')
      setValue('farm_name', sellerProfile.farm_name || '')
      setValue('business_description', sellerProfile.business_description || '')
      setValue('years_of_experience', sellerProfile.years_of_experience || 0)
    }
  }, [sellerProfile, setValue])

  const onSubmit = (data: SellerProfileFormValues) => {
    updateSeller({
      userId: sellerId,
      updates: data,
    })
  }

  if (isLoading || !sellerId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-full rounded-none" />
      </div>
    )
  }

  const statusColors = {
    pending: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/20',
    verified: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/20',
    rejected: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/20',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 select-none font-sans">
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/profile')}
          className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Back to Hub
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight font-heading text-foreground">Seller Profile Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">Configure your farm business credentials and verification statuses.</p>
      </div>

      {sellerProfile && (
        <div className={`border p-4 flex items-start gap-3 rounded-none ${statusColors[sellerProfile.verification_status]}`}>
          {sellerProfile.verification_status === 'pending' && <HelpCircle className="size-6 shrink-0 mt-0.5" />}
          {sellerProfile.verification_status === 'verified' && <CheckCircle2 className="size-6 shrink-0 mt-0.5" />}
          {sellerProfile.verification_status === 'rejected' && <AlertCircle className="size-6 shrink-0 mt-0.5" />}
          
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide block">
              Verification Status: {sellerProfile.verification_status}
            </span>
            <p className="text-[10px] leading-relaxed opacity-90">
              {sellerProfile.verification_status === 'pending' && 'Our moderators are reviewing your farm details. You can continue uploading produce during this review phase.'}
              {sellerProfile.verification_status === 'verified' && 'Congratulations! Your farm is verified. Customers will see a Verification Badge on your marketplace items.'}
              {sellerProfile.verification_status === 'rejected' && 'Your verification was declined. Please verify your farm years of experience and resubmit.'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border border-border bg-card rounded-none">
          <CardHeader className="p-6 border-b border-border">
            <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
              Business Coordinates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="business_name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Business / Entity Name
              </Label>
              <Input
                id="business_name"
                {...register('business_name')}
                placeholder="e.g. Springfield Agro Coop"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.business_name && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.business_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="farm_name" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Farm Name
              </Label>
              <Input
                id="farm_name"
                {...register('farm_name')}
                placeholder="e.g. Springfield Green Fields"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.farm_name && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.farm_name.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="years" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Years of Agricultural Experience
              </Label>
              <Input
                id="years"
                type="number"
                {...register('years_of_experience', { valueAsNumber: true })}
                placeholder="e.g. 5"
                className="rounded-none text-xs"
                disabled={isPending}
              />
              {errors.years_of_experience && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.years_of_experience.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none">
                Farm / Business Description
              </Label>
              <textarea
                id="desc"
                {...register('business_description')}
                placeholder="Write a brief overview of your farm, farming practices, and produce values..."
                className="flex w-full border border-border bg-card p-3 rounded-none text-xs min-h-[120px] focus-visible:ring-emerald-600 focus-visible:ring-2 outline-none font-sans"
                disabled={isPending}
              />
              {errors.business_description && (
                <span className="text-[10px] text-red-500 font-bold tracking-wide block">
                  {errors.business_description.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            className="rounded-none cursor-pointer text-xs uppercase font-bold tracking-wider"
          >
            {isPending ? 'Saving...' : 'Update Farm Profile'}
          </Button>
        </div>
      </form>
    </div>
  )
}
