import { createClient } from '@/lib/supabase/client'
import { Order, OrderStatus } from '../types'

export async function getBuyerOrders(
  buyerId: string,
  statusFilter?: OrderStatus | 'all',
  searchQuery?: string
): Promise<Order[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('order_status', statusFilter)
  }

  if (searchQuery) {
    query = query.ilike('delivery_name', `%${searchQuery}%`)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as Order[]) || []
}
