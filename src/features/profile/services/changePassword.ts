import { createClient } from '@/lib/supabase/client'

export async function changePassword(password: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    throw new Error(error.message)
  }
}
