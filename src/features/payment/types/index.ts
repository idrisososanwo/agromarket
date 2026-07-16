export interface StellarWallet {
  publicKey: string
  secretKey?: string
  balance: number
}

export interface Payment {
  id: string
  order_id: string
  buyer_id: string
  transaction_hash: string
  stellar_account: string
  amount_xlm: number
  network: string
  payment_status: 'pending' | 'success' | 'failed'
  created_at: string
  updated_at: string
}

export interface PaymentDetails {
  orderId: string
  amountXlm: number
  platformAddress: string
  paymentStatus: 'pending' | 'paid' | 'failed'
}
