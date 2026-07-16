import { createClient } from '@/lib/supabase/client'
import { OrderStatus } from '../types'

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  userId: string,
  trackingNumber?: string
): Promise<void> {
  const supabase = createClient()

  const updateFields: any = {
    order_status: newStatus,
    updated_by: userId,
    updated_at: new Date().toISOString(),
  }

  if (newStatus === 'shipped') {
    updateFields.shipped_at = new Date().toISOString()
    if (trackingNumber) {
      updateFields.tracking_number = trackingNumber
    }
  } else if (newStatus === 'delivered') {
    updateFields.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateFields)
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }
}
