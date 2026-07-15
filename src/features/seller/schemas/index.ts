import { z } from 'zod'

export const productFormSchema = z.object({
  title: z.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name cannot exceed 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be a positive number'),
  quantity: z.number().nonnegative('Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  location: z.string().min(1, 'Location is required'),
  image_url: z.string().nullable(),
  status: z.enum(['active', 'draft', 'out_of_stock']),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
