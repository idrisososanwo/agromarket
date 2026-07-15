import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSellerProducts } from '../services/getSellerProducts'
import { getSellerDashboardData } from '../services/getSellerDashboardData'
import { getSellerOrders } from '../services/getSellerOrders'
import { createProduct } from '../services/createProduct'
import { updateProduct } from '../services/updateProduct'
import { deleteProduct } from '../services/deleteProduct'
import { updateOrderStatus } from '../services/updateOrderStatus'
import { toast } from 'sonner'
import { ProductFormValues } from '../schemas'

export function useSellerProducts(sellerId: string) {
  return useQuery({
    queryKey: ['seller-products', sellerId],
    queryFn: () => getSellerProducts(sellerId),
    enabled: !!sellerId,
  })
}

export function useSellerDashboard(sellerId: string) {
  return useQuery({
    queryKey: ['seller-dashboard', sellerId],
    queryFn: () => getSellerDashboardData(sellerId),
    enabled: !!sellerId,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ values, sellerId }: { values: ProductFormValues; sellerId: string }) =>
      createProduct(values, sellerId),
    onSuccess: (data, variables) => {
      toast.success('Product created successfully!')
      queryClient.invalidateQueries({ queryKey: ['seller-products', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create product')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values, sellerId }: { id: string; values: ProductFormValues; sellerId: string }) =>
      updateProduct(id, values, sellerId),
    onSuccess: (data, variables) => {
      toast.success('Product updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['seller-products', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, sellerId }: { id: string; sellerId: string }) =>
      deleteProduct(id, sellerId),
    onSuccess: (data, variables) => {
      toast.success('Product deleted successfully!')
      queryClient.invalidateQueries({ queryKey: ['seller-products', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product')
    },
  })
}

export function useSellerOrders(sellerId: string) {
  return useQuery({
    queryKey: ['seller-orders', sellerId],
    queryFn: () => getSellerOrders(sellerId),
    enabled: !!sellerId,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      sellerId,
    }: {
      orderId: string
      status: 'pending' | 'completed' | 'cancelled'
      sellerId: string
    }) => updateOrderStatus(orderId, status, sellerId),
    onSuccess: (data, variables) => {
      toast.success(`Order marked as ${variables.status}!`)
      queryClient.invalidateQueries({ queryKey: ['seller-orders', variables.sellerId] })
      queryClient.invalidateQueries({ queryKey: ['seller-dashboard', variables.sellerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status')
    },
  })
}
