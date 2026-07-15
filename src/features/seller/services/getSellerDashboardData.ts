import { createClient } from '@/lib/supabase/client'
import { SellerDashboardStats, SellerOrder } from '../types'

export async function getSellerDashboardData(sellerId: string): Promise<SellerDashboardStats> {
  const supabase = createClient()

  // 1. Fetch total products count
  const { count: totalProducts, error: pError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', sellerId)

  if (pError) throw new Error(pError.message)

  // 2. Fetch active products count
  const { count: activeProducts, error: apError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', sellerId)
    .eq('status', 'active')

  if (apError) throw new Error(apError.message)

  // 3. Fetch orders and calculate revenue
  const { data: orders, error: oError } = await supabase
    .from('orders')
    .select('*, profiles:buyer_id(full_name, avatar_url), products:product_id(title, image_url)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (oError) throw new Error(oError.message)

  const typedOrders = (orders as unknown as SellerOrder[]) || []
  const totalOrders = typedOrders.length
  
  // Calculate completed order revenue
  const revenue = typedOrders
    .filter(order => order.status === 'completed')
    .reduce((acc, order) => acc + Number(order.total_price), 0)

  return {
    totalProducts: totalProducts || 0,
    activeProducts: activeProducts || 0,
    totalOrders,
    revenue,
    recentOrders: typedOrders.slice(0, 5),
  }
}
