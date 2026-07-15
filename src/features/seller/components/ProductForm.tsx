'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { productFormSchema, ProductFormValues } from '../schemas'
import { ProductImageUploader } from './ProductImageUploader'

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  userId: string
}

export function ProductForm({ initialValues, onSubmit, isPending, userId }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      description: initialValues?.description ?? '',
      category: initialValues?.category ?? 'Vegetables',
      price: initialValues?.price ?? 0,
      quantity: initialValues?.quantity ?? 0,
      unit: initialValues?.unit ?? 'kg',
      location: initialValues?.location ?? '',
      image_url: initialValues?.image_url ?? null,
      status: initialValues?.status ?? 'active',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="title">Product Name</Label>
          <Input
            id="title"
            type="text"
            disabled={isPending}
            placeholder="e.g. Fresh Organic Tomatoes"
            {...register('title')}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            disabled={isPending}
            placeholder="Describe your produce (e.g. freshly harvested, pesticide-free, sweet and juicy...)"
            rows={4}
            className="w-full border border-transparent border-b-input bg-transparent px-0 py-1 text-base transition-[color,border-color] outline-none placeholder:text-muted-foreground focus-visible:border-b-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-b-destructive md:text-sm resize-none"
            {...register('description')}
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            disabled={isPending}
            className="w-full h-10 border-b border-input bg-transparent text-sm py-1 outline-none focus:border-b-ring text-foreground dark:bg-zinc-950 cursor-pointer"
            {...register('category')}
          >
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Tubers">Tubers</option>
            <option value="Livestock">Livestock</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Availability Status</Label>
          <select
            id="status"
            disabled={isPending}
            className="w-full h-10 border-b border-input bg-transparent text-sm py-1 outline-none focus:border-b-ring text-foreground dark:bg-zinc-950 cursor-pointer"
            {...register('status')}
          >
            <option value="active">Active (Visible)</option>
            <option value="draft">Draft (Hidden)</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            disabled={isPending}
            placeholder="0.00"
            {...register('price', { valueAsNumber: true })}
            aria-invalid={!!errors.price}
          />
          {errors.price && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.price.message}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            disabled={isPending}
            placeholder="0.0"
            {...register('quantity', { valueAsNumber: true })}
            aria-invalid={!!errors.quantity}
          />
          {errors.quantity && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Unit */}
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            type="text"
            disabled={isPending}
            placeholder="e.g. kg, box, bunch"
            {...register('unit')}
            aria-invalid={!!errors.unit}
          />
          {errors.unit && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.unit.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Farm Location</Label>
          <Input
            id="location"
            type="text"
            disabled={isPending}
            placeholder="e.g. California, US"
            {...register('location')}
            aria-invalid={!!errors.location}
          />
          {errors.location && (
            <p className="text-xs text-destructive mt-1" role="alert">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Image Uploader */}
        <div className="space-y-2 col-span-2">
          <Label>Product Image</Label>
          <Controller
            name="image_url"
            control={control}
            render={({ field }) => (
              <ProductImageUploader
                value={field.value}
                onChange={field.onChange}
                userId={userId}
                disabled={isPending}
              />
            )}
          />
        </div>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={isPending} className="flex-1 cursor-pointer">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Product...
            </>
          ) : (
            'Save Product'
          )}
        </Button>
      </div>
    </form>
  )
}
