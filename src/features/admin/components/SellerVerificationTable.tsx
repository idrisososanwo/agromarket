'use client'

import React from 'react'
import { SellerProfileAdmin } from '../types'
import { useApproveSeller } from '../hooks/use-admin-queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react'

interface SellerVerificationTableProps {
  sellers: SellerProfileAdmin[]
}

export function SellerVerificationTable({ sellers }: SellerVerificationTableProps) {
  const { mutate: approve, isPending } = useApproveSeller()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="rounded-none bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600 text-[9px] font-bold uppercase tracking-wide gap-1">
            <CheckCircle2 className="size-3" />
            Verified
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive" className="rounded-none text-[9px] font-bold uppercase tracking-wide gap-1">
            <XCircle className="size-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="rounded-none bg-amber-600 text-[9px] font-bold uppercase tracking-wide gap-1">
            <HelpCircle className="size-3" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Seller Name</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Farm / Business Name</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Experience</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sellers.map((s) => (
            <TableRow key={s.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4">
                <span className="text-xs font-bold text-foreground block">
                  {s.profiles?.full_name || 'AgroMarket Seller'}
                </span>
                <span className="text-[9px] text-muted-foreground block max-w-xs truncate">
                  {s.business_description || 'No description provided.'}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div>
                  <span className="text-xs font-bold text-foreground block">{s.business_name || 'N/A'}</span>
                  <span className="text-[9px] text-muted-foreground block">Farm: {s.farm_name || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-foreground py-4">
                {s.years_of_experience} Years
              </TableCell>
              <TableCell className="py-4">
                {getStatusBadge(s.verification_status)}
              </TableCell>
              <TableCell className="py-4 text-right">
                {s.verification_status === 'pending' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => approve({ userId: s.user_id, status: 'rejected' })}
                      disabled={isPending}
                      size="sm"
                      variant="outline"
                      className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => approve({ userId: s.user_id, status: 'verified' })}
                      disabled={isPending}
                      size="sm"
                      className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                    >
                      Approve
                    </Button>
                  </div>
                )}
                {s.verification_status !== 'pending' && (
                  <Button
                    onClick={() => approve({ userId: s.user_id, status: 'pending' })}
                    disabled={isPending}
                    size="sm"
                    variant="outline"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Reset Status
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
