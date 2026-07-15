import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCart } from '../services/getCart'
import { getBuyerDashboard } from '../services/getBuyerDashboard'
import { addToCart } from '../services/addToCart'
import { updateCartItem } from '../services/updateCartItem'
import { removeCartItem } from '../services/removeCartItem'
import { clearCart } from '../services/clearCart'
import { toast } from 'sonner'

export function useCart(buyerId: string) {
  return useQuery({
    queryKey: ['cart', buyerId],
    queryFn: () => getCart(buyerId),
    enabled: !!buyerId,
  })
}

export function useBuyerDashboard(buyerId: string) {
  return useQuery({
    queryKey: ['buyer-dashboard', buyerId],
    queryFn: () => getBuyerDashboard(buyerId),
    enabled: !!buyerId,
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ buyerId, productId, quantity }: { buyerId: string; productId: string; quantity: number }) =>
      addToCart(buyerId, productId, quantity),
    onSuccess: (data, variables) => {
      toast.success('Item added to cart!')
      queryClient.invalidateQueries({ queryKey: ['cart', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add item to cart')
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartItemId, quantity, buyerId }: { cartItemId: string; quantity: number; buyerId: string }) =>
      updateCartItem(cartItemId, quantity),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update quantity')
    },
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartItemId, buyerId }: { cartItemId: string; buyerId: string }) =>
      removeCartItem(cartItemId),
    onSuccess: (data, variables) => {
      toast.success('Item removed from cart')
      queryClient.invalidateQueries({ queryKey: ['cart', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove item')
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ buyerId }: { buyerId: string }) =>
      clearCart(buyerId),
    onSuccess: (data, variables) => {
      toast.success('Cart cleared!')
      queryClient.invalidateQueries({ queryKey: ['cart', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to clear cart')
    },
  })
}
