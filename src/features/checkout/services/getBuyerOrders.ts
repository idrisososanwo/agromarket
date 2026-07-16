import { createClient } from '@/lib/supabase/client'
import { Order } from '../types'

export async function getBuyerOrders(buyerId: string): Promise<Order[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data || []
}
