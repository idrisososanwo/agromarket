export interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  phone: string | null
  role: 'buyer' | 'seller'
  bio: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  preferred_language: string
  preferred_currency: string
  notification_email: boolean
  notification_push: boolean
  created_at: string
  updated_at: string
}

export interface SellerProfile {
  id: string
  user_id: string
  business_name: string | null
  business_description: string | null
  farm_name: string | null
  years_of_experience: number
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
}
