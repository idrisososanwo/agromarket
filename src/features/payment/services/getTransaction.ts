import { getHorizonServer } from './stellar-config'

export async function getTransaction(txHash: string): Promise<any> {
  const server = getHorizonServer()
  return server.transactions().transaction(txHash).call()
}
