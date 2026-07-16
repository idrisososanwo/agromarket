import { createClient } from '@/lib/supabase/client'
import { SellerOrder } from '../types'

export async function getSellerOrders(sellerId: string): Promise<SellerOrder[]> {
  const supabase = createClient()
  
  const { data: items, error } = await supabase
    .from('order_items')
    .select('*, orders(buyer_id, profiles:buyer_id(full_name, avatar_url)), products:product_id(title, image_url)')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const typedOrders: SellerOrder[] = (items || []).map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    seller_id: item.seller_id,
    buyer_id: item.orders?.buyer_id || '',
    quantity: Number(item.quantity),
    total_price: Number(item.total_price),
    status: item.status,
    created_at: item.created_at,
    profiles: item.orders?.profiles || null,
    products: item.products || null,
  }))

  return typedOrders
}
