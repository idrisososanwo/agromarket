import { useQuery } from '@tanstack/react-query'
import { getProductById } from '../services/getProductById'
import { searchProducts } from '../services/searchProducts'

export function useProducts(searchQuery: string, category?: string) {
  return useQuery({
    queryKey: ['products', searchQuery, category],
    queryFn: () => searchProducts({ searchQuery, category }),
    staleTime: 30 * 1000, // Cache results for 30 seconds
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // Cache product details for 60 seconds
  })
}
