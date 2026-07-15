import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BuyerSidebar } from '@/features/buyer/components/BuyerSidebar'
import { BuyerNavbar } from '@/features/buyer/components/BuyerNavbar'

export const metadata = {
  title: 'Buyer Portal | AgroMarket',
  description: 'Manage your cart, track your orders, and explore fresh produce recommendations.',
}

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50/30 dark:bg-zinc-950">
      <BuyerSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <BuyerNavbar
          fullName={profile?.full_name}
          avatarUrl={profile?.avatar_url}
          email={user.email}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
