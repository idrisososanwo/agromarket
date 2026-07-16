import { createClient } from '@/lib/supabase/client'

export async function createPayment(
  orderId: string,
  buyerId: string,
  txHash: string,
  stellarAccount: string,
  amountXlm: number
): Promise<void> {
  const supabase = createClient()

  // 1. Avoid duplicate processing of the same transaction
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('transaction_hash', txHash)
    .maybeSingle()

  if (existing) {
    throw new Error('This transaction has already been registered.')
  }

  // 2. Log to database
  const { error } = await supabase
    .from('payments')
    .insert({
      order_id: orderId,
      buyer_id: buyerId,
      transaction_hash: txHash,
      stellar_account: stellarAccount,
      amount_xlm: amountXlm,
      network: 'testnet',
      payment_status: 'success',
    })

  if (error) {
    throw new Error(error.message)
  }
}
