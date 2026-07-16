import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '../services/getProfile'
import { updateProfile } from '../services/updateProfile'
import { uploadAvatar } from '../services/uploadAvatar'
import { changePassword } from '../services/changePassword'
import { changeEmail } from '../services/changeEmail'
import { getSellerProfile } from '../services/getSellerProfile'
import { updateSellerProfile } from '../services/updateSellerProfile'
import { toast } from 'sonner'
import { UserProfile, SellerProfile } from '../types'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<UserProfile> }) =>
      updateProfile(userId, updates),
    onSuccess: (_, variables) => {
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile.')
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      uploadAvatar(userId, file),
    onSuccess: (publicUrl, variables) => {
      toast.success('Avatar uploaded successfully!')
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar.')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (password: string) => changePassword(password),
    onSuccess: () => {
      toast.success('Password updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password.')
    },
  })
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: (email: string) => changeEmail(email),
    onSuccess: () => {
      toast.success('Email update request sent! Please verify your new email address.')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change email address.')
    },
  })
}

export function useSellerProfile(userId: string) {
  return useQuery({
    queryKey: ['seller-profile', userId],
    queryFn: () => getSellerProfile(userId),
    enabled: !!userId,
  })
}

export function useUpdateSellerProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<SellerProfile> }) =>
      updateSellerProfile(userId, updates),
    onSuccess: (_, variables) => {
      toast.success('Seller profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['seller-profile', variables.userId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update seller profile.')
    },
  })
}
