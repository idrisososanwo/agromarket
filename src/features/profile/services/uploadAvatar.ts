import { createClient } from '@/lib/supabase/client'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = createClient()

  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`

  // Upload to avatars bucket
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { cacheControl: '3600', upsert: true })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  // Sync back to profiles
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (profileError) {
    throw new Error(profileError.message)
  }

  return publicUrl
}
