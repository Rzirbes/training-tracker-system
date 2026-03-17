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
}

export function ConfirmCancelDialog({
  onClose,
  onSuccess,
  route,
  title,
  description = 'Essa ação não poderá ser desfeita depois.',
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      const response = await serverFetcher<{ title: string; message: string }>(route, {
        method: 'PATCH',
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
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex flex-col gap-1 mt-3'>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className='mt-1'>
        <Button variant='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant='destructive' onClick={handleDelete} isLoading={isDeleting}>
          Sim
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
