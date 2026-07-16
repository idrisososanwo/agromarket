'use client'

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, User } from 'lucide-react'
import { useUploadAvatar } from '../hooks/use-profile-queries'
import { toast } from 'sonner'

interface AvatarUploaderProps {
  userId: string
  currentAvatarUrl?: string | null
}

export function AvatarUploader({ userId, currentAvatarUrl }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutate: upload, isPending } = useUploadAvatar()
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be under 2MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File format must be an image.')
      return
    }

    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    upload({ userId, file })
  }

  const handleTriggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group size-28 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar Preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="size-12 text-muted-foreground stroke-[1.2]" />
        )}

        {isPending && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="size-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTriggerUpload}
          disabled={isPending}
          className="cursor-pointer rounded-none text-xs font-bold uppercase tracking-wider gap-1.5"
        >
          <Camera className="size-4" />
          Upload Photo
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-1.5 select-none">
          Max size 2MB. JPG, PNG, WEBP.
        </p>
      </div>
    </div>
  )
}
