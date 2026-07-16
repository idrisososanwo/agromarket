'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDashboardStats } from '../services/getDashboardStats'
import { getUsers } from '../services/getUsers'
import { getProducts } from '../services/getProducts'
import { getOrders } from '../services/getOrders'
import { getPayments } from '../services/getPayments'
import { getReports } from '../services/getReports'
import { approveSeller } from '../services/approveSeller'
import { suspendUser } from '../services/suspendUser'
import { deleteProduct } from '../services/deleteProduct'
import { resolveReport } from '../services/resolveReport'
import { toast } from 'sonner'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getDashboardStats(),
  })
}

export function useAdminUsers(search?: string, roleFilter?: string) {
  return useQuery({
    queryKey: ['admin-users', search, roleFilter],
    queryFn: () => getUsers(search, roleFilter),
  })
}

export function useAdminProducts(search?: string, categoryFilter?: string) {
  return useQuery({
    queryKey: ['admin-products', search, categoryFilter],
    queryFn: () => getProducts(search, categoryFilter),
  })
}

export function useAdminOrders(search?: string, statusFilter?: string) {
  return useQuery({
    queryKey: ['admin-orders', search, statusFilter],
    queryFn: () => getOrders(search, statusFilter),
  })
}

export function useAdminPayments(search?: string, statusFilter?: string) {
  return useQuery({
    queryKey: ['admin-payments', search, statusFilter],
    queryFn: () => getPayments(search, statusFilter),
  })
}

export function useAdminReports(statusFilter?: string, targetType?: string) {
  return useQuery({
    queryKey: ['admin-reports', statusFilter, targetType],
    queryFn: () => getReports(statusFilter, targetType),
  })
}

export function useApproveSeller() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'verified' | 'rejected' | 'pending' }) =>
      approveSeller(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Seller verification status updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update seller verification status')
    },
  })
}

export function useSuspendUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) =>
      suspendUser(userId, isSuspended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User suspension status updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update user suspension status')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, isRemoved }: { productId: string; isRemoved: boolean }) =>
      deleteProduct(productId, isRemoved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Product status updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update product status')
    },
  })
}

export function useResolveReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: 'resolved' | 'dismissed' }) =>
      resolveReport(reportId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] })
      toast.success('Report resolved successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to resolve report')
    },
  })
}
