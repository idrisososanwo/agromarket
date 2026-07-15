import React from 'react'
  import { redirect } from 'next/navigation'
  import { createClient } from '@/lib/supabase/server'
  import { SellerSidebar } from '@/features/seller/components/SellerSidebar'
  import { SellerNavbar } from '@/features/seller/components/SellerNavbar'

  export const metadata = {
    title: 'Seller Dashboard | AgroMarket',
    description: 'Manage your farm listings, track customer orders, and view revenues.',
  }

  export default async function SellerLayout({ children }: { children: React.ReactNode }) {
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

    if (profile?.role !== 'seller') {
      redirect('/')
    }

    return (
      <div className="flex h-screen overflow-hidden bg-zinc-50/30 dark:bg-zinc-950">
        <SellerSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <SellerNavbar
            fullName={profile.full_name}
            avatarUrl={profile.avatar_url}
            email={user.email}
          />

          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    )
  }
