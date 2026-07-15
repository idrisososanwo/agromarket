import { createClient } from '@/lib/supabase/client'
import { RegisterInput } from '../types'

export async function register({ email, password, fullName }: RegisterInput) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
