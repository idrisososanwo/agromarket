import { createClient } from '@/lib/supabase/client'
import { OrderDetails } from '../types'

export async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:buyer_id(full_name, email),
      order_items(*, products(title, image_url, unit)),
      payments(transaction_hash, stellar_account, amount_xlm, payment_status, created_at)
    `)
    .eq('id', orderId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return (data as unknown as OrderDetails) || null
}
