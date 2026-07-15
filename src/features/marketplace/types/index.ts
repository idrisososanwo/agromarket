export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  updated_at?: string
}

export interface Product {
  id: string
  seller_id: string
  title: string
  description: string
  category: string
  price: number
  quantity: number
  unit: string
  location: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface ProductWithSeller extends Product {
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}
