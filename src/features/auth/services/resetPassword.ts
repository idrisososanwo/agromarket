import { createClient } from '@/lib/supabase/client'

export async function resetPassword(password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
