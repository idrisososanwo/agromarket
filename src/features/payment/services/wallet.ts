import * as StellarSdk from 'stellar-sdk'
import { getHorizonServer } from './stellar-config'

export function generateKeypair() {
  const pair = StellarSdk.Keypair.random()
  return {
    publicKey: pair.publicKey(),
    secretKey: pair.secret(),
  }
}

export async function fundWithFriendbot(publicKey: string): Promise<void> {
  const url = `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Friendbot funding request failed. Please try again.')
  }
}

export async function getAccountBalance(publicKey: string): Promise<number> {
  const server = getHorizonServer()
  try {
    const account = await server.loadAccount(publicKey)
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native')
    return xlmBalance ? parseFloat(xlmBalance.balance) : 0
  } catch (error: any) {
    if (error.response?.status === 404) {
      return 0
    }
    throw error
  }
}
