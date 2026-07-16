import { getHorizonServer, PLATFORM_STELLAR_ADDRESS } from './stellar-config'

export interface VerificationResult {
  isValid: boolean
  amountXlm: number
  sourceAccount: string
  memo: string
  error?: string
}

export async function verifyTransaction(
  txHash: string,
  expectedOrderId: string,
  expectedAmountXlm: number
): Promise<VerificationResult> {
  const server = getHorizonServer()

  try {
    const tx = await server.transactions().transaction(txHash).call()

    if (!tx) {
      return { isValid: false, amountXlm: 0, sourceAccount: '', memo: '', error: 'Transaction not found on Stellar Testnet.' }
    }

    const expectedMemo = expectedOrderId.replace(/-/g, '').substring(0, 28)
    if (tx.memo !== expectedMemo) {
      return {
        isValid: false,
        amountXlm: 0,
        sourceAccount: '',
        memo: tx.memo || '',
        error: `Transaction memo mismatch. Expected "${expectedMemo}" but found "${tx.memo}".`,
      }
    }

    const operations = await server.operations().forTransaction(txHash).call()
    // Cast to any to bypass union properties compiler checks
    const paymentOp = operations.records.find(
      (op: any) => op.type === 'payment' && op.asset_type === 'native'
    ) as any

    if (!paymentOp) {
      return { isValid: false, amountXlm: 0, sourceAccount: '', memo: tx.memo || '', error: 'No native XLM payment operation found in this transaction.' }
    }

    if (paymentOp.to !== PLATFORM_STELLAR_ADDRESS) {
      return {
        isValid: false,
        amountXlm: 0,
        sourceAccount: paymentOp.from,
        memo: tx.memo || '',
        error: `Transaction destination mismatch. Expected platform address but found "${paymentOp.to}".`,
      }
    }

    const paidAmount = parseFloat(paymentOp.amount)
    if (Math.abs(paidAmount - expectedAmountXlm) > 0.0001) {
      return {
        isValid: false,
        amountXlm: paidAmount,
        sourceAccount: paymentOp.from,
        memo: tx.memo || '',
        error: `Payment amount mismatch. Expected ${expectedAmountXlm} XLM but found ${paidAmount} XLM.`,
      }
    }

    return {
      isValid: true,
      amountXlm: paidAmount,
      sourceAccount: paymentOp.from,
      memo: tx.memo || '',
    }
  } catch (error: any) {
    return {
      isValid: false,
      amountXlm: 0,
      sourceAccount: '',
      memo: '',
      error: error.message || 'Horizon request failed during transaction verification.',
    }
  }
}
