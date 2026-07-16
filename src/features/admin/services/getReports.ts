import { createClient } from '@/lib/supabase/client'
import { ReportAdmin } from '../types'

export async function getReports(statusFilter?: string, targetType?: string): Promise<ReportAdmin[]> {
  const supabase = createClient()

  let query = supabase
    .from('reports')
    .select('*, reporter:reporter_id(id, full_name, email)')
    .order('created_at', { ascending: false })

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter)
  }

  if (targetType && targetType !== 'all') {
    query = query.eq('target_type', targetType)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []) as ReportAdmin[]
}
