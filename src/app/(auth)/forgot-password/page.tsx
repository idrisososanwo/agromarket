import { AuthCard } from '@/features/auth/components/AuthCard'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export const metadata = {
  title: 'Forgot Password | AgroMarket',
  description: 'Request a password reset link for your AgroMarket account.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <ForgotPasswordForm />
    </AuthCard>
  )
}
