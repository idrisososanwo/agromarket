import { createClient } from '@/lib/supabase/client'

export async function resolveReport(reportId: string, status: 'resolved' | 'dismissed'): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('reports')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', reportId)

  if (error) throw error
}
