'use client'

import React from 'react'
import { UserProfileAdmin } from '../types'
import { useSuspendUser } from '../hooks/use-admin-queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { User } from 'lucide-react'

interface UserTableProps {
  users: UserProfileAdmin[]
}

export function UserTable({ users }: UserTableProps) {
  const { mutate: toggleSuspend, isPending } = useSuspendUser()

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Member</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Email</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Role</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.full_name || 'User'} className="h-full w-full object-cover" />
                    ) : (
                      <User className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <Link href={`/admin/users/${u.id}`} className="text-xs font-bold text-foreground hover:underline">
                    {u.full_name || 'AgroMarket Member'}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground py-4">{u.email || 'N/A'}</TableCell>
              <TableCell className="py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-muted text-muted-foreground">
                  {u.role}
                </span>
              </TableCell>
              <TableCell className="py-4">
                {u.is_suspended ? (
                  <Badge variant="destructive" className="rounded-none text-[9px] font-bold uppercase tracking-wide">
                    Suspended
                  </Badge>
                ) : (
                  <Badge className="rounded-none text-[9px] font-bold uppercase tracking-wide bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-4 text-right">
                {u.is_suspended ? (
                  <Button
                    onClick={() => toggleSuspend({ userId: u.id, isSuspended: false })}
                    disabled={isPending}
                    size="sm"
                    variant="outline"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  >
                    Reactivate
                  </Button>
                ) : (
                  <Button
                    onClick={() => toggleSuspend({ userId: u.id, isSuspended: true })}
                    disabled={isPending || u.role === 'admin'}
                    size="sm"
                    variant="destructive"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Suspend
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
