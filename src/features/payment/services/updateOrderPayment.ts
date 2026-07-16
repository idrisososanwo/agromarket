import { createClient } from '@/lib/supabase/client'

export async function updateOrderPayment(
  orderId: string,
  paymentStatus: 'paid' | 'failed' | 'pending',
  txHash?: string
): Promise<void> {
  const supabase = createClient()

  const updateFields: any = {
    payment_status: paymentStatus,
    updated_at: new Date().toISOString(),
  }

  if (paymentStatus === 'paid') {
    updateFields.order_status = 'confirmed'
    updateFields.payment_reference = txHash
    updateFields.paid_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('orders')
    .update(updateFields)
    .eq('id', orderId)

  if (error) {
    throw new Error(error.message)
  }
}
