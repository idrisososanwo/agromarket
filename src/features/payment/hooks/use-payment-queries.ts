import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitTransaction } from '../services/submitTransaction'
import { verifyTransaction } from '../services/verifyTransaction'
import { createPayment } from '../services/createPayment'
import { updateOrderPayment } from '../services/updateOrderPayment'
import { toast } from 'sonner'

export function useSubmitPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      xdr,
      secretKey,
      publicKey,
      orderId,
      buyerId,
      amountXlm,
    }: {
      xdr: string
      secretKey: string
      publicKey: string
      orderId: string
      buyerId: string
      amountXlm: number
    }) => {
      // 1. Submit to Horizon Network
      const txHash = await submitTransaction(xdr, secretKey)
      
      // 2. Verify on server
      const verification = await verifyTransaction(txHash, orderId, amountXlm)
      
      if (!verification.isValid) {
        throw new Error(verification.error || 'Transaction verification failed.')
      }

      // 3. Log to payments table
      await createPayment(orderId, buyerId, txHash, publicKey, amountXlm)

      // 4. Update orders status
      await updateOrderPayment(orderId, 'paid', txHash)

      return txHash
    },
    onSuccess: (txHash, variables) => {
      toast.success('Stellar payment processed and order confirmed!')
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['buyer-dashboard', variables.buyerId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Payment submission failed.')
    },
  })
}
