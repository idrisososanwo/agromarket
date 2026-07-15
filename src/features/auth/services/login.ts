import { createClient } from '@/lib/supabase/client'
import { LoginInput } from '../types'

export async function login({ email, password }: LoginInput) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
