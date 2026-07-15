import { createClient } from '@/lib/supabase/client'
import { ForgotPasswordInput } from '../types'

export async function forgotPassword({ email }: ForgotPasswordInput) {
  const supabase = createClient()
  const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
