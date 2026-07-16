import { z } from 'zod'
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas'
import { User, Session } from '@supabase/supabase-js'

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

export type UserRole = 'buyer' | 'seller' | 'admin'

export type Permission =
  // Buyer permissions
  | 'purchase_products'
  | 'manage_cart'
  | 'view_orders'
  // Seller permissions
  | 'create_products'
  | 'edit_products'
  | 'delete_products'
  | 'manage_orders'
  // Admin permissions
  | 'manage_users'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_payments'
  | 'manage_platform'

export interface UserSession {
  user: User | null
  session: Session | null
  role: UserRole | null
  permissions: Permission[]
  isLoading: boolean
}
