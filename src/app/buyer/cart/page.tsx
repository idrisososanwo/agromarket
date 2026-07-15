'use client'

import React, { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from '@/features/buyer/hooks/use-buyer-queries'
import { DashboardHeader } from '@/features/buyer/components/DashboardHeader'
import { CartList } from '@/features/buyer/components/CartList'
import { CartSummary } from '@/features/buyer/components/CartSummary'
import { EmptyCartState } from '@/features/buyer/components/EmptyCartState'
import { ContinueShoppingButton } from '@/features/buyer/components/ContinueShoppingButton'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function BuyerCartPage() {
  const supabase = createClient()
  const [buyerId, setBuyerId] = useState<string>('')
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setBuyerId(user.id)
    })
  }, [])

  const { data: cartItems, isLoading } = useCart(buyerId)
  
  const { mutate: updateQty, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem()
  const { mutate: clearCartItems, isPending: isClearing } = useClearCart()

  const handleQuantityChange = (cartItemId: string, newQty: number) => {
    updateQty({ cartItemId, quantity: newQty, buyerId })
  }

  const handleRemoveItem = (cartItemId: string) => {
    removeItem({ cartItemId, buyerId })
  }

  const handleConfirmClearCart = () => {
    clearCartItems(
      { buyerId },
      {
        onSuccess: () => {
          setIsClearDialogOpen(false)
        },
      }
    )
  }

  const handleCheckout = () => {
    toast.success('[Placeholder] Checkout completed! Stellar payment pipeline ready.')
    clearCartItems({ buyerId })
  }

  if (isLoading || !buyerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-24 w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-none" />
          </div>
          <Skeleton className="h-64 w-full rounded-none" />
        </div>
      </div>
    )
  }

  const hasItems = cartItems && cartItems.length > 0
  
  const subtotal = cartItems?.reduce((acc, item) => {
    const price = item.products?.price || 0
    return acc + price * item.quantity
  }, 0) || 0

  const totalQuantity = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const isPending = isUpdating || isRemoving || isClearing

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Shopping Cart"
        description="Review your selected items, adjust quantities, and proceed to secure checkout."
      >
        {hasItems && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsClearDialogOpen(true)}
            disabled={isPending}
            className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200/50 dark:hover:bg-red-950/20 rounded-none gap-1.5 font-sans"
          >
            <Trash2 className="size-4" />
            Clear Cart
          </Button>
        )}
      </DashboardHeader>

      {hasItems ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CartList
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              isUpdating={isPending}
            />

            <div className="flex justify-start">
              <ContinueShoppingButton />
            </div>
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              totalQuantity={totalQuantity}
              onCheckout={handleCheckout}
              isPending={isPending}
            />
          </div>
        </div>
      ) : (
        <EmptyCartState />
      )}

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 p-6 border border-border rounded-none">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-semibold tracking-wide uppercase font-heading text-destructive">
              Clear Shopping Cart
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to empty your shopping cart? All items will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearDialogOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmClearCart}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isClearing ? 'Clearing...' : 'Clear Cart'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
