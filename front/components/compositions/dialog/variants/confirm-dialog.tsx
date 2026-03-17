'use client'
import { useState } from 'react'
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@/components/ui'
import { serverFetcher } from '@/services'

interface Props {
  route: string
  onClose(): void
  onSuccess(): void
  title: string
  description?: string
  method?: 'POST' | 'PATCH' | 'PUT'
  body?: any
}

export function ConfirmDialog({
  onClose,
  onSuccess,
  route,
  title,
  description = 'Essa ação poderá ser desfeita depois.',
  method = 'PATCH',
  body,
}: Props) {
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleConfirm() {
    try {
      setIsUpdating(true)
      const response = await serverFetcher<{ title: string; message: string }>(route, {
        method,
        body
      })
      toast({
        title: response.data.title,
        description: response.data.message,
        variant: response.ok ? 'success' : 'destructive',
      })
      onSuccess()
    } catch {
      toast({
        title: 'Desculpe, não foi possível concluir a ação!',
        description: 'Verifique e tente novamente em instantes...',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
      onClose()
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex flex-col gap-1 mt-6'>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className='mt-1'>
        <Button variant='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} isLoading={isUpdating}>
         Confirmar
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
