import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrder } from '../services/getOrder'
import { getBuyerOrders } from '../services/getBuyerOrders'
import { createOrder } from '../services/createOrder'
import { CheckoutDeliveryInfo } from '../types'
import { CartItem } from '@/features/buyer/types'
import { toast } from 'sonner'

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  })
}

export function useBuyerOrders(buyerId: string) {
  return useQuery({
    queryKey: ['buyer-orders', buyerId],
    queryFn: () => getBuyerOrders(buyerId),
    enabled: !!buyerId,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      buyerId,
      cartItems,
      deliveryInfo,
    }: {
      buyerId: string
      cartItems: CartItem[]
      deliveryInfo: CheckoutDeliveryInfo
    }) => createOrder(buyerId, cartItems, deliveryInfo),
    onSuccess: (data, variables) => {
      toast.success('Order placed successfully!')
      queryClient.invalidateQueries({ queryKey: ['cart', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-orders', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order')
    },
  })
}
