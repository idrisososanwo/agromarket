import { createClient } from '@/lib/supabase/client'

export interface UnreviewedItem {
  id: string // order item id
  order_id: string
  product_id: string
  seller_id: string
  products: {
    title: string
    image_url: string | null
  } | null
}

export async function getUnreviewedItems(): Promise<UnreviewedItem[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // 1. Get all delivered orders for the current buyer
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('order_status', 'delivered')

  if (ordersError) throw ordersError
  if (!orders || orders.length === 0) return []

  const orderIds = orders.map((o) => o.id)

  // 2. Get order items for those orders
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select('id, order_id, product_id, seller_id, products(title, image_url)')
    .in('order_id', orderIds)

  if (itemsError) throw itemsError
  if (!orderItems || orderItems.length === 0) return []

  // 3. Get existing reviews by this buyer
  const { data: existingReviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('order_id, product_id')
    .eq('buyer_id', user.id)

  if (reviewsError) throw reviewsError

  // Create a lookup map of existing reviews
  const reviewedMap = new Set(
    (existingReviews ?? []).map((r) => `${r.order_id}-${r.product_id}`)
  )

  // Filter order items that haven't been reviewed yet
  const unreviewed: UnreviewedItem[] = (orderItems as any[])
    .filter((item) => item.product_id && !reviewedMap.has(`${item.order_id}-${item.product_id}`))
    .map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      seller_id: item.seller_id,
      products: item.products,
    }))

  return unreviewed
}
