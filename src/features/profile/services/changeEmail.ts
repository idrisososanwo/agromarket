import { createClient } from '@/lib/supabase/client'

export async function changeEmail(email: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.auth.updateUser({ email })

  if (error) {
    throw new Error(error.message)
  }
}
