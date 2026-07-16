import { createClient } from '@/lib/supabase/client'
import { ProductAdmin } from '../types'

export async function getProducts(search?: string, categoryFilter?: string): Promise<ProductAdmin[]> {
  const supabase = createClient()

  let query = supabase
    .from('products')
    .select('*, profiles:seller_id(id, full_name, role, is_suspended)')
    .order('created_at', { ascending: false })

  if (categoryFilter && categoryFilter !== 'all') {
    query = query.eq('category', categoryFilter)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []) as ProductAdmin[]
}
