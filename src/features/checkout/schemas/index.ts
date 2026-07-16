import { z } from 'zod'

export const checkoutFormSchema = z.object({
  delivery_name: z.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  delivery_phone: z.string()
    .min(8, 'Phone number must be at least 8 digits')
    .max(20, 'Phone number cannot exceed 20 digits')
    .regex(/^[+\d\s()-]+$/, 'Invalid phone number format'),
  delivery_address: z.string()
    .min(10, 'Delivery address must be at least 10 characters')
    .max(300, 'Delivery address cannot exceed 300 characters'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').nullable().optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
