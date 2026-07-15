import { createClient } from '@/lib/supabase/client'
import { BuyerDashboardData, BuyerOrder } from '../types'
import { ProductWithSeller } from '@/features/marketplace/types'

export async function getBuyerDashboard(buyerId: string): Promise<BuyerDashboardData> {
  const supabase = createClient()

  // 1. Fetch recent buyer orders
  const { data: orders, error: oError } = await supabase
    .from('orders')
    .select('*, products:product_id(title, image_url)')
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (oError) throw new Error(oError.message)

  // 2. Fetch cart summary totals
  const { data: cartItems, error: cError } = await supabase
    .from('cart_items')
    .select('quantity, products:product_id(price)')
    .eq('buyer_id', buyerId)

  if (cError) throw new Error(cError.message)

  const cartTotalItems = cartItems?.length || 0
  const cartGrandTotal = cartItems?.reduce((acc, item) => {
    const price = Number((item as any).products?.price || 0)
    return acc + Number(item.quantity) * price
  }, 0) || 0

  // 3. Fetch recommended active products joined with profiles (matches ProductWithSeller)
  const { data: recommended, error: rError } = await supabase
    .from('products')
    .select('*, profiles:seller_id(full_name, avatar_url)')
    .eq('status', 'active')
    .limit(4)

  if (rError) throw new Error(rError.message)

  return {
    recentOrders: (orders as unknown as BuyerOrder[]) || [],
    cartTotalItems,
    cartGrandTotal,
    recommendedProducts: (recommended as unknown as ProductWithSeller[]) || [],
  }
}
