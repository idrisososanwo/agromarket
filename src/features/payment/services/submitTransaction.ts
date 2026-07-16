import * as StellarSdk from 'stellar-sdk'
import { getHorizonServer } from './stellar-config'

export async function submitTransaction(
  xdr: string,
  buyerSecretKey: string
): Promise<string> {
  const server = getHorizonServer()

  // 1. Load transaction from XDR
  const transaction = new StellarSdk.Transaction(xdr, StellarSdk.Networks.TESTNET)

  // 2. Sign with recipient's private key
  const buyerKeypair = StellarSdk.Keypair.fromSecret(buyerSecretKey)
  transaction.sign(buyerKeypair)

  // 3. Broadcast to network
  const result = await server.submitTransaction(transaction)
  
  return result.hash
}
