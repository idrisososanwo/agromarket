import { AuthCard } from '@/features/auth/components/AuthCard'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const metadata = {
  title: 'Sign In | AgroMarket',
  description: 'Sign in to your AgroMarket account to buy and sell produce.',
}

export default function LoginPage() {
  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  )
}
