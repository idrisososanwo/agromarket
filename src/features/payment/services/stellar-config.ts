import * as StellarSdk from 'stellar-sdk'

const HORIZON_TESTNET_URL = 'https://horizon-testnet.stellar.org'

export function getHorizonServer() {
  return new StellarSdk.Horizon.Server(HORIZON_TESTNET_URL)
}

// Escrow public address where XLM payments will be processed
export const PLATFORM_STELLAR_ADDRESS = process.env.NEXT_PUBLIC_PLATFORM_STELLAR_ADDRESS || 'GD6W5F6E3RXT2UUN27P4XGJD5N4P3S3GPHKTRJOHZ722S4MXP6PLTR4H'
