import { createClient } from '@/lib/supabase/client'

export async function deleteProduct(productId: string, isRemoved: boolean): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('products')
    .update({ is_removed: isRemoved, updated_at: new Date().toISOString() })
    .eq('id', productId)

  if (error) throw error
}
