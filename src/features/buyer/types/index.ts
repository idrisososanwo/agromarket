import { Product, ProductWithSeller } from '@/features/marketplace/types'

export interface CartItem {
  id: string
  buyer_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  products: {
    title: string
    price: number
    unit: string
    image_url: string | null
    quantity: number // available stock
  } | null
}

export interface BuyerOrder {
  id: string
  product_id: string | null
  seller_id: string
  buyer_id: string
  quantity: number
  total_price: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  products?: {
    title: string
    image_url: string | null
  } | null
}

export interface BuyerDashboardData {
  recentOrders: BuyerOrder[]
  cartTotalItems: number
  cartGrandTotal: number
  recommendedProducts: ProductWithSeller[]
}
