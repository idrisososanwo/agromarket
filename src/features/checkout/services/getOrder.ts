import { createClient } from '@/lib/supabase/client'
import { Order, OrderItem } from '../types'

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    products: {
      title: string
      image_url: string | null
      unit: string
    } | null
  })[]
}

export async function getOrder(orderId: string): Promise<OrderWithItems> {
  const supabase = createClient()

  // 1. Fetch parent Order
  const { data: order, error: oError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (oError || !order) {
    throw new Error(oError?.message || 'Order not found')
  }

  // 2. Fetch Order Items joined with products
  const { data: items, error: iError } = await supabase
    .from('order_items')
    .select('*, products:product_id(title, image_url, unit)')
    .eq('order_id', orderId)

  if (iError) {
    throw new Error(iError.message)
  }

  return {
    ...order,
    order_items: items || [],
  }
}
