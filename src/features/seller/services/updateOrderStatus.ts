import { createClient } from '@/lib/supabase/client'

export async function updateOrderStatus(
  orderItemId: string,
  status: 'pending' | 'completed' | 'cancelled',
  sellerId: string
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('order_items')
    .update({ status })
    .eq('id', orderItemId)
    .eq('seller_id', sellerId)

  if (error) {
    throw new Error(error.message)
  }
}
