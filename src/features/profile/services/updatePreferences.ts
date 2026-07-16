import { updateProfile } from './updateProfile'

export async function updatePreferences(
  userId: string,
  preferences: {
    preferred_language?: string
    preferred_currency?: string
    notification_email?: boolean
    notification_push?: boolean
  }
): Promise<void> {
  return updateProfile(userId, preferences)
}
