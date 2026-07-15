import { AuthCard } from '@/features/auth/components/AuthCard'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata = {
  title: 'Sign Up | AgroMarket',
  description: 'Create an AgroMarket account to buy and sell produce.',
}

export default function RegisterPage() {
  return (
    <AuthCard>
      <RegisterForm />
    </AuthCard>
  )
}
