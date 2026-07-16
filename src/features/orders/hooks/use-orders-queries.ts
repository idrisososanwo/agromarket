import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBuyerOrders } from '../services/getBuyerOrders'
import { getSellerOrders } from '../services/getSellerOrders'
import { getOrderDetails } from '../services/getOrderDetails'
import { updateOrderStatus } from '../services/updateOrderStatus'
import { cancelOrder } from '../services/cancelOrder'
import { OrderStatus } from '../types'
import { toast } from 'sonner'

export function useBuyerOrders(buyerId: string, status?: OrderStatus | 'all', search?: string) {
  return useQuery({
    queryKey: ['buyer-orders', buyerId, status, search],
    queryFn: () => getBuyerOrders(buyerId, status, search),
    enabled: !!buyerId,
  })
}

export function useSellerOrders(sellerId: string, status?: OrderStatus | 'all', search?: string) {
  return useQuery({
    queryKey: ['seller-orders', sellerId, status, search],
    queryFn: () => getSellerOrders(sellerId, status, search),
    enabled: !!sellerId,
  })
}

export function useOrderDetailsQuery(orderId: string) {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      newStatus,
      userId,
      trackingNumber,
    }: {
      orderId: string
      newStatus: OrderStatus
      userId: string
      trackingNumber?: string
    }) => updateOrderStatus(orderId, newStatus, userId, trackingNumber),
    onSuccess: (_, variables) => {
      toast.success(`Order status updated to ${variables.newStatus}!`)
      queryClient.invalidateQueries({ queryKey: ['order-details', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] })
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status.')
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      buyerId,
      reason,
    }: {
      orderId: string
      buyerId: string
      reason: string
    }) => cancelOrder(orderId, buyerId, reason),
    onSuccess: (_, variables) => {
      toast.success('Order cancelled successfully.')
      queryClient.invalidateQueries({ queryKey: ['order-details', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-orders'] })
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel order.')
    },
  })
}
