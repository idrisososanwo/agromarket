import { createClient } from '@/lib/supabase/client'
import { OrderAdmin } from '../types'

export async function getOrders(search?: string, statusFilter?: string): Promise<OrderAdmin[]> {
  const supabase = createClient()

  let query = supabase
    .from('orders')
    .select('*, profiles:buyer_id(id, full_name, email, phone)')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('order_status', statusFilter)
  }

  if (search) {
    query = query.or(`delivery_name.ilike.%${search}%,delivery_address.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []) as OrderAdmin[]
}
