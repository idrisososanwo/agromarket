import { AuthCard } from '@/features/auth/components/AuthCard'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export const metadata = {
  title: 'Update Password | AgroMarket',
  description: 'Set a new password for your AgroMarket account.',
}

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <ResetPasswordForm />
    </AuthCard>
  )
}
