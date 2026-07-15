export type ProductStatus = 'active' | 'draft' | 'out_of_stock'

export interface SellerProduct {
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
  status: ProductStatus
  created_at: string
  updated_at: string
}

export interface SellerOrder {
  id: string
  product_id: string | null
  seller_id: string
  buyer_id: string
  quantity: number
  total_price: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
  products?: {
    title: string
    image_url: string | null
  } | null
}

export interface SellerDashboardStats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  revenue: number
  recentOrders: SellerOrder[]
}
