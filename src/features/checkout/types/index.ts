export interface CheckoutDeliveryInfo {
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  notes?: string | null
}

export interface Order {
  id: string
  buyer_id: string
  subtotal: number
  delivery_fee: number
  total_amount: number
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'awaiting_payment' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  delivery_name: string
  delivery_phone: string
  delivery_address: string
  notes: string | null
  created_at: string
  updated_at: string
}

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

export interface CheckoutTotals {
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
}
