import * as StellarSdk from 'stellar-sdk'
import { getHorizonServer, PLATFORM_STELLAR_ADDRESS } from './stellar-config'

export async function buildTransaction(
  buyerPublicKey: string,
  amountXlm: number,
  orderId: string
): Promise<string> {
  const server = getHorizonServer()

  // 1. Load sequence details
  const buyerAccount = await server.loadAccount(buyerPublicKey)

  // 2. Build payment and set order memo (UUID stripped of hyphens to fit 28-byte text memo limits)
  const memoText = orderId.replace(/-/g, '').substring(0, 28)

  const transaction = new StellarSdk.TransactionBuilder(buyerAccount, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: PLATFORM_STELLAR_ADDRESS,
        asset: StellarSdk.Asset.native(),
        amount: amountXlm.toFixed(7),
      })
    )
    .addMemo(StellarSdk.Memo.text(memoText))
    .setTimeout(180)
    .build()

  return transaction.toXDR()
}
