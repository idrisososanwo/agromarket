import { z } from 'zod'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas'

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>


export interface UserProfile {
  id: string
  email?: string
  fullName?: string
  avatarUrl?: string
}
