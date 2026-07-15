'use client'

import React, { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

interface ProductImageProps {
  src: string | null
  title: string
  className?: string
}

export function ProductImage({ src, title, className = '' }: ProductImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-400 select-none ${className}`}>
        <div className="flex flex-col items-center gap-1.5">
          <ImageIcon className="size-8 stroke-[1.5]" />
          <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">No Image</span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={title}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  )
}
