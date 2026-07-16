'use client'

import React from 'react'
import { ReportAdmin } from '../types'
import { useResolveReport } from '../hooks/use-admin-queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ReportsTableProps {
  reports: ReportAdmin[]
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const { mutate: resolve, isPending } = useResolveReport()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="rounded-none bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600 text-[9px] font-bold uppercase tracking-wide">Resolved</Badge>
      case 'dismissed':
        return <Badge className="rounded-none bg-zinc-500 text-[9px] font-bold uppercase tracking-wide">Dismissed</Badge>
      default:
        return <Badge className="rounded-none bg-red-600 text-[9px] font-bold uppercase tracking-wide">Pending</Badge>
    }
  }

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Reporter</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Target Type</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Reason</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((r) => (
            <TableRow key={r.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4">
                <span className="text-xs font-bold text-foreground block">
                  {r.reporter?.full_name || 'AgroMarket Member'}
                </span>
                <span className="text-[9px] text-muted-foreground block">
                  {r.reporter?.email || 'N/A'}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-muted text-muted-foreground">
                  {r.target_type}
                </span>
              </TableCell>
              <TableCell className="text-xs text-foreground py-4 max-w-xs truncate">
                {r.reason}
              </TableCell>
              <TableCell className="py-4">
                {getStatusBadge(r.status)}
              </TableCell>
              <TableCell className="py-4 text-right">
                {r.status === 'pending' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => resolve({ reportId: r.id, status: 'dismissed' })}
                      disabled={isPending}
                      size="sm"
                      variant="outline"
                      className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer border-zinc-500 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-950/20"
                    >
                      Dismiss
                    </Button>
                    <Button
                      onClick={() => resolve({ reportId: r.id, status: 'resolved' })}
                      disabled={isPending}
                      size="sm"
                      className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                    >
                      Resolve
                    </Button>
                  </div>
                )}
                {r.status !== 'pending' && (
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Closed
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
