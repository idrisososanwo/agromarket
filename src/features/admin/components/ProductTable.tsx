'use client'

import React from 'react'
import { ProductAdmin } from '../types'
import { useDeleteProduct } from '../hooks/use-admin-queries'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag } from 'lucide-react'

interface ProductTableProps {
  products: ProductAdmin[]
}

export function ProductTable({ products }: ProductTableProps) {
  const { mutate: toggleRemove, isPending } = useDeleteProduct()

  return (
    <div className="border border-border bg-card rounded-none font-sans overflow-x-auto select-none">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Product</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Seller</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Category</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Price</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground py-3 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} className="border-b border-border hover:bg-muted/30">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="size-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">{p.title}</span>
                    <span className="text-[9px] text-muted-foreground block">{p.quantity} {p.unit} remaining</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground py-4">
                {p.profiles?.full_name || 'AgroMarket Seller'}
              </TableCell>
              <TableCell className="py-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-border bg-muted text-muted-foreground">
                  {p.category}
                </span>
              </TableCell>
              <TableCell className="text-xs font-bold text-foreground py-4">
                ${Number(p.price).toFixed(2)}
              </TableCell>
              <TableCell className="py-4">
                {p.is_removed ? (
                  <Badge variant="destructive" className="rounded-none text-[9px] font-bold uppercase tracking-wide">
                    Removed
                  </Badge>
                ) : (
                  <Badge className="rounded-none text-[9px] font-bold uppercase tracking-wide bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-600">
                    Active
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-4 text-right">
                {p.is_removed ? (
                  <Button
                    onClick={() => toggleRemove({ productId: p.id, isRemoved: false })}
                    disabled={isPending}
                    size="sm"
                    variant="outline"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    onClick={() => toggleRemove({ productId: p.id, isRemoved: true })}
                    disabled={isPending}
                    size="sm"
                    variant="destructive"
                    className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Remove
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
