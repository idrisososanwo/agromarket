import { createClient } from '@/lib/supabase/client'

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'completed' | 'cancelled',
  sellerId: string
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .eq('seller_id', sellerId)

  if (error) {
    throw new Error(error.message)
  }
}
