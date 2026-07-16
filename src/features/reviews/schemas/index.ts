import { z } from 'zod'

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  title: z
    .string()
    .max(120, 'Title must be 120 characters or fewer')
    .optional(),
  comment: z
    .string()
    .min(20, 'Review must be at least 20 characters')
    .max(2000, 'Review must be 2000 characters or fewer'),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export const reportReviewSchema = z.object({
  reason: z.enum(
    ['spam', 'fake_review', 'offensive_content', 'irrelevant', 'other']
  ),
  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or fewer')
    .optional(),
})

export type ReportReviewFormValues = z.infer<typeof reportReviewSchema>

export const sellerResponseSchema = z.object({
  response: z
    .string()
    .min(10, 'Response must be at least 10 characters')
    .max(1000, 'Response must be 1000 characters or fewer'),
})

export type SellerResponseFormValues = z.infer<typeof sellerResponseSchema>
