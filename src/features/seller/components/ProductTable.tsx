import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SellerProduct } from '../types'
import { ProductStatusBadge } from './ProductStatusBadge'
import { ProductActionsMenu } from './ProductActionsMenu'
import { ProductImage } from '@/features/marketplace/components/ProductImage'
import { ProductPrice } from '@/features/marketplace/components/ProductPrice'

interface ProductTableProps {
  products: SellerProduct[]
  onDeleteClick: (product: SellerProduct) => void
}

export function ProductTable({ products, onDeleteClick }: ProductTableProps) {
  return (
    <div className="border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="p-2">
                <div className="size-10 border border-border bg-muted overflow-hidden flex items-center justify-center">
                  <ProductImage
                    src={product.image_url}
                    title={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-semibold text-foreground">{product.title}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{product.category}</TableCell>
              <TableCell>
                <ProductPrice price={product.price} unit={product.unit} className="text-sm font-semibold" />
              </TableCell>
              <TableCell className="text-sm text-foreground">
                {product.quantity} {product.unit}s
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="text-right">
                <ProductActionsMenu
                  productId={product.id}
                  onDeleteClick={() => onDeleteClick(product)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
