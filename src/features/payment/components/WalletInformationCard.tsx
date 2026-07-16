'use client'

import React, { useState } from 'react'
import { Wallet, Key, RefreshCw, PlusCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fundWithFriendbot, getAccountBalance, generateKeypair } from '../services/wallet'
import { toast } from 'sonner'

interface WalletInformationCardProps {
  onWalletLoaded: (publicKey: string, secretKey: string) => void
  amountNeeded: number
}

export function WalletInformationCard({ onWalletLoaded, amountNeeded }: WalletInformationCardProps) {
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFunding, setIsFunding] = useState(false)

  const fetchBalance = async (pubKey: string) => {
    setIsLoadingBalance(true)
    try {
      const bal = await getAccountBalance(pubKey)
      setBalance(bal)
    } catch (_) {
      toast.error('Failed to load wallet balance from Testnet.')
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleLoadWallet = () => {
    if (!publicKey || !secretKey) {
      toast.error('Please fill in both public and secret keys.')
      return
    }
    fetchBalance(publicKey)
    onWalletLoaded(publicKey, secretKey)
    toast.success('Wallet configured successfully!')
  }

  const handleGenerateWallet = () => {
    setIsGenerating(true)
    try {
      const wallet = generateKeypair()
      setPublicKey(wallet.publicKey)
      setSecretKey(wallet.secretKey)
      setBalance(0)
      onWalletLoaded(wallet.publicKey, wallet.secretKey)
      toast.success('Generated new Stellar Testnet account keys!')
    } catch (_) {
      toast.error('Failed to generate wallet keypair.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFundWallet = async () => {
    if (!publicKey) {
      toast.error('Please generate or load a wallet first.')
      return
    }
    setIsFunding(true)
    try {
      await fundWithFriendbot(publicKey)
      toast.success('Demo wallet funded with 10,000 Testnet XLM!')
      await fetchBalance(publicKey)
    } catch (err: any) {
      toast.error(err.message || 'Friendbot funding failed.')
    } finally {
      setIsFunding(false)
    }
  }

  return (
    <Card className="border border-border bg-card rounded-none">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Stellar Testnet Wallet Config
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerateWallet}
            disabled={isGenerating || isFunding}
            className="cursor-pointer flex-1 rounded-none text-xs uppercase font-bold tracking-wider gap-1.5"
          >
            <PlusCircle className="size-4" />
            Create Demo Wallet
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleFundWallet}
            disabled={!publicKey || isFunding}
            className="cursor-pointer flex-1 rounded-none text-xs uppercase font-bold tracking-wider gap-1.5"
          >
            <RefreshCw className={`size-4 ${isFunding ? 'animate-spin' : ''}`} />
            {isFunding ? 'Funding Account...' : 'Fund with Friendbot'}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="space-y-1.5">
            <Label htmlFor="publicKey" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 select-none">
              <Wallet className="size-3.5" />
              Stellar Public Address (starts with G)
            </Label>
            <Input
              id="publicKey"
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder="e.g. GD6W5F6E..."
              disabled={isFunding || isGenerating}
              className="rounded-none font-mono text-xs focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="secretKey" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1 select-none">
              <Key className="size-3.5" />
              Stellar Secret Key (starts with S)
            </Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="e.g. SA7J2L4M..."
              disabled={isFunding || isGenerating}
              className="rounded-none font-mono text-xs focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-500"
            />
          </div>

          <Button
            type="button"
            onClick={handleLoadWallet}
            disabled={!publicKey || !secretKey}
            className="w-full cursor-pointer rounded-none text-xs uppercase font-bold tracking-wider"
          >
            Configure / Sync Wallet Balance
          </Button>
        </div>

        {publicKey && (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block select-none">Wallet Balance</span>
              <span className="text-sm font-bold text-foreground mt-0.5 block">
                {isLoadingBalance ? 'Loading...' : balance !== null ? `${balance.toFixed(2)} XLM` : 'Not loaded'}
              </span>
            </div>
            {balance !== null && balance >= amountNeeded ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider select-none">
                <CheckCircle className="size-4" />
                Funds Available
              </span>
            ) : balance !== null ? (
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider select-none">
                Insufficient Balance
              </span>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
