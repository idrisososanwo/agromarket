import { createClient } from '@/lib/supabase/client'
import { DashboardStatsAdmin } from '../types'

export async function getDashboardStats(): Promise<DashboardStatsAdmin> {
  const supabase = createClient()

  const [
    { count: totalUsers },
    { count: totalBuyers },
    { count: totalSellers },
    { count: totalProducts },
    { count: activeListings },
    { count: pendingSellerVerifications },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'buyer'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_removed', false),
    supabase.from('seller_profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
  ])

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const [
    { count: ordersToday },
    { data: ordersData },
    { count: pendingPayments },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).gte('created_at', startOfDay.toISOString()),
    supabase.from('orders').select('total_amount').eq('payment_status', 'paid'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
  ])

  const totalRevenue = (ordersData || []).reduce((sum, item) => sum + Number(item.total_amount || 0), 0)

  return {
    totalUsers: totalUsers || 0,
    totalBuyers: totalBuyers || 0,
    totalSellers: totalSellers || 0,
    totalProducts: totalProducts || 0,
    activeListings: activeListings || 0,
    ordersToday: ordersToday || 0,
    totalRevenue,
    pendingPayments: pendingPayments || 0,
    pendingSellerVerifications: pendingSellerVerifications || 0,
  }
}
