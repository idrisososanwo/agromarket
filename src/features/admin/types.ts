export interface UserProfileAdmin {
  id: string
  full_name: string | null
  avatar_url: string | null
  email: string | null
  phone: string | null
  role: 'buyer' | 'seller' | 'admin'
  bio: string | null
  is_suspended: boolean
  city: string | null
  country: string | null
  created_at: string
}

export interface SellerProfileAdmin {
  id: string
  user_id: string
  business_name: string | null
  business_description: string | null
  farm_name: string | null
  years_of_experience: number
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  profiles?: UserProfileAdmin | null
}

export interface ProductAdmin {
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
  is_removed: boolean
  is_flagged: boolean
  created_at: string
  profiles?: UserProfileAdmin | null
}

export interface OrderAdmin {
  id: string
  buyer_id: string
  subtotal: number
  delivery_fee: number
  total_amount: number
  payment_status: string
  order_status: string
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  notes: string | null
  created_at: string
  profiles?: UserProfileAdmin | null
}

export interface PaymentAdmin {
  id: string
  order_id: string
  buyer_id: string
  transaction_hash: string
  stellar_account: string
  amount_xlm: number
  network: string
  payment_status: string
  created_at: string
  profiles?: UserProfileAdmin | null
}

export interface ReportAdmin {
  id: string
  reporter_id: string
  target_type: 'buyer' | 'seller' | 'product'
  target_id: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
  reporter?: UserProfileAdmin | null
}

export interface DashboardStatsAdmin {
  totalUsers: number
  totalBuyers: number
  totalSellers: number
  totalProducts: number
  activeListings: number
  ordersToday: number
  totalRevenue: number
  pendingPayments: number
  pendingSellerVerifications: number
}
