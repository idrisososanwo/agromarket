import { createClient } from '@/lib/supabase/client'
import { PaymentAdmin } from '../types'

export async function getPayments(search?: string, statusFilter?: string): Promise<PaymentAdmin[]> {
  const supabase = createClient()

  let query = supabase
    .from('payments')
    .select('*, profiles:buyer_id(id, full_name, email)')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('payment_status', statusFilter)
  }

  if (search) {
    query = query.or(`transaction_hash.ilike.%${search}%,stellar_account.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []) as PaymentAdmin[]
}
