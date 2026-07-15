import { createClient } from '@/lib/supabase/client'

export async function deleteProduct(id: string, sellerId: string): Promise<void> {
  const supabase = createClient()
  
  // Attempt to delete associated image from storage first
  const { data: product } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .eq('seller_id', sellerId)
    .single()

  if (product?.image_url) {
    try {
      const urlParts = product.image_url.split('/product-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from('product-images').remove([filePath])
      }
    } catch (e) {
      console.error('Failed to delete image from storage:', e)
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('seller_id', sellerId)

  if (error) {
    throw new Error(error.message)
  }
}
