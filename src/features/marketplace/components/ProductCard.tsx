import React from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ProductWithSeller } from '../types'
import { ProductImage } from './ProductImage'
import { ProductPrice } from './ProductPrice'
import { ProductBadge } from './ProductBadge'

interface ProductCardProps {
  product: ProductWithSeller
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/marketplace/${product.id}`} className="group block h-full outline-none">
      <Card className="h-full flex flex-col overflow-hidden border border-border bg-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border">
          <ProductImage
            src={product.image_url}
            title={product.title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3">
            <ProductBadge>{product.category}</ProductBadge>
          </div>
        </div>

        <CardHeader className="p-4 pb-1">
          <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            Seller: {product.profiles?.full_name || 'AgroMarket Seller'}
          </p>
        </CardHeader>

        <CardContent className="px-4 py-1 flex-1">
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-border bg-zinc-50/50 dark:bg-zinc-900/10">
          <ProductPrice price={product.price} unit={product.unit} />
          
          <div className="flex items-center text-[11px] text-muted-foreground gap-0.5 max-w-[50%]">
            <MapPin className="size-3 stroke-[1.5] shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
