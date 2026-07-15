'use client'

import React, { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadProductImage } from '../services/uploadProductImage'
import { toast } from 'sonner'

interface ProductImageUploaderProps {
  value: string | null | undefined
  onChange: (url: string | null) => void
  userId: string
  disabled?: boolean
}

export function ProductImageUploader({ value, onChange, userId, disabled }: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadProductImage(file, userId)
      onChange(url)
      toast.success('Image uploaded successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden border border-border group">
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={handleUploadClick}
              disabled={disabled || isUploading}
              className="cursor-pointer"
            >
              Replace
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="xs"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
          className="flex flex-col items-center justify-center aspect-video w-full max-w-sm border border-dashed border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50/50 hover:bg-zinc-100/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-xs font-semibold">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <Upload className="size-6 stroke-[1.5]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Upload Image</span>
              <span className="text-[10px] opacity-60">PNG, JPG up to 5MB</span>
            </div>
          )}
        </button>
      )}
    </div>
  )
}
