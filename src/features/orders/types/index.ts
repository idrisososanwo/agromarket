export type OrderStatus =
  | 'awaiting_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  seller_id: string
  quantity: number
  unit_price: number
  total_price: number
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  products?: {
    title: string
    image_url: string | null
    unit: string
  } | null
}

export interface Order {
  id: string
  buyer_id: string
  subtotal: number
  delivery_fee: number
  total_amount: number
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: OrderStatus
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  notes: string | null
  tracking_number: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancelled_reason: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string | null
    email?: string | null
  } | null
  order_items?: OrderItem[]
}

export interface OrderDetails extends Order {
  order_items: (OrderItem & {
    products: {
      title: string
      image_url: string | null
      unit: string
    } | null
  })[]
  payments?: {
    transaction_hash: string
    stellar_account: string
    amount_xlm: number
    payment_status: string
    created_at: string
  }[] | null
}
