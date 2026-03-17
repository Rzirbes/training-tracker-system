'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { UploadCloud, Image as ImageIcon, Trash, Crop } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ImageCropper,
} from '@/components/ui'
import { cn } from '@/lib/utils'

type FilePickerFieldProps = {
  name: string
  label: string
  accept?: string | string[]
  centered?: boolean
  defaultImageUrl?: string 
  onDelete?(): void
}

export function AvatarPicker({
  name,
  label,
  accept = 'image/*',
  centered = false,
  defaultImageUrl = '',
  onDelete,
}: FilePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useFormContext()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showCropper, setShowCropper] = useState(false)

  const typeValidation = (file: File) =>
    Array.isArray(accept) ? accept.some((t) => file.type.startsWith(t)) : !file.type.startsWith(accept)

  const createFileFromUrl = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'image/*',
        },
      })
      const blob = await response.blob()
      const file = new File([blob], 'avatar.jpeg', { type: blob.type })
      return file
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (defaultImageUrl) {
      // Verifica se a URL fornecida já é uma URL válida
      const isUrlValid = /\.(jpeg|jpg|png|gif|bmp)$/i.test(defaultImageUrl)
      if (isUrlValid) {
        createFileFromUrl(defaultImageUrl).then((file) => {
          setOriginalFile(file)
          setPreviewUrl(defaultImageUrl)
          setOriginalPreview(defaultImageUrl)
        })
      } else {
        // Tenta criar um arquivo a partir da URL
        createFileFromUrl(defaultImageUrl).then((file) => {
          const url = file ? URL.createObjectURL(file) : null
          setOriginalFile(file)
          setOriginalPreview(url)
          setPreviewUrl(url)
        })
      }
    }
  }, [defaultImageUrl])

  function handleFileSelect(file: File | null) {
    if (!file || !typeValidation(file)) {
      return
    }

    const url = URL.createObjectURL(file)
    setOriginalFile(file)
    setOriginalPreview(url)
    setPreviewUrl(url)
    setShowCropper(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    handleFileSelect(file)
  }

  function handleClear() {
    form.setValue(name, undefined, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setPreviewUrl(null)
    setOriginalFile(null)
    setOriginalPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    onDelete?.()
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFileSelect(file)
  }, [])

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              className={cn(
                'relative border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer',
                isDragging ? 'border-primary bg-muted' : 'border-muted text-muted-foreground'
              )}
              onClick={() => !showCropper && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type='file'
                ref={inputRef}
                accept={Array.isArray(accept) ? accept.join() : accept}
                onChange={handleFileChange}
                className='hidden'
              />

              {previewUrl && !showCropper ? (
                <div className={cn('flex flex-col items-center gap-4 w-full', centered && 'justify-center')}>
                  <Avatar className='h-48 w-48 rounded-full shadow'>
                    <AvatarImage src={previewUrl} alt='Preview' />
                    <AvatarFallback>
                      <ImageIcon className='h-8 w-8' />
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm font-medium truncate max-w-[75%]'>{originalFile?.name}</span>
                  <div className='flex gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        if (originalFile) {
                          const url = URL.createObjectURL(originalFile)
                          setOriginalPreview(url)
                          setShowCropper(true)
                        }
                      }}
                    >
                      <Crop className='h-4 w-4' />
                      Ajustar
                    </Button>

                    <Button
                      type='button'
                      variant='ghost'
                      className='hover:bg-destructive'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClear()
                      }}
                    >
                      <Trash className='h-4 w-4' />
                      Remover
                    </Button>
                  </div>
                </div>
              ) : showCropper && originalPreview ? (
                <ImageCropper
                  imageSrc={originalPreview}
                  onCropComplete={(croppedFile, croppedUrl) => {
                    form.setValue(name, croppedFile, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                    setPreviewUrl(croppedUrl)
                    setShowCropper(false)
                  }}
                  onCancel={() => setShowCropper(false)}
                />
              ) : (
                <div className='flex flex-col items-center gap-2'>
                  <UploadCloud className='w-8 h-8' />
                  <p className='text-sm'>
                    Arraste uma imagem aqui ou <span className='underline'>clique para selecionar</span>
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
