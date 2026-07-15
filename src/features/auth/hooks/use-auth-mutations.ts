import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { login } from '../services/login'
import { register } from '../services/register'
import { logout } from '../services/logout'
import { forgotPassword } from '../services/forgotPassword'
import { resetPassword } from '../services/resetPassword'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Successfully logged in!')
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
      router.push('/')
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to login')
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to register')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logged out successfully')
      queryClient.setQueryData(['auth-user'], null)
      router.push('/login')
      router.refresh()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to log out')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success('Password reset link sent to your email!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reset link')
    },
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password updated successfully!')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update password')
    },
  })
}
