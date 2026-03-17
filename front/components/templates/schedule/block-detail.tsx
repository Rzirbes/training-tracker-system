"use client"

import Link from 'next/link'
import { useMemo } from 'react'
import { Edit, Trash, Lock as LockIcon } from 'lucide-react'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Badge, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'
import { useDialogContext } from '@/contexts'
import { RouteEnum, UserRoleEnum } from '@/enums'
import type { IScheduleCardBlock } from './card'

interface Props {
  userRole: UserRoleEnum
  block: IScheduleCardBlock
  onClose(): void
  onEdit(): void
  onDelete(): void
}

export function BlockDetail({ block, onClose, onEdit, onDelete, userRole }: Props) {
  const { start, end, description, trainer } = block
  const { dialog } = useDialogContext()
  const isAdmin = userRole === UserRoleEnum.ADMIN

  const dayLabel = useMemo(() => {
    return capitalizeFirstLetter(start.toLocaleDateString('pt-BR', { dateStyle: 'full' }))
  }, [start])

  return (
    <div className='grid grid-cols-1 gap-2'>
      <h1 className='text-lg font-bold mb-2 flex items-center gap-2'>
        <LockIcon className='size-5' />
        Bloqueio de horário
      </h1>

      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Dia</p>
        <p>{dayLabel}</p>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='grid grid-rows-2'>
          <p className='text-sm font-bold'>Hora de início</p>
          <p>{start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className='grid grid-rows-2'>
          <p className='text-sm font-bold'>Hora do fim</p>
          <p>{end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>

      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Treinador</p>
        {isAdmin ? (
          <Link
            href={RouteEnum.UPDATE_TEAM_MEMBERS.replace(':ID', trainer.id)}
            className='text-primary hover:underline'
            onClick={() => dialog.current?.close()}
          >
            {trainer.name}
          </Link>
        ) : (
          <p>{trainer.name}</p>
        )}
      </div>

      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Descrição</p>
        <p className='whitespace-pre-wrap'>{description?.trim() || 'Período indisponível'}</p>
      </div>

      {/* status/legenda simples para reforçar visual */}
      <div className='grid gap-1'>
        <p className='text-sm font-bold'>Status</p>
        <Badge variant='secondary' className='flex items-center gap-2'>
          <LockIcon className='size-4' />
          Bloqueado
        </Badge>
      </div>

      {/* Ações */}
      {isAdmin && (
        <div className='flex gap-2 justify-end'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='w-full' tabIndex={-1}>
                <Button variant='outline' className='w-full' onClick={onEdit}>
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar Bloqueio</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='w-full' tabIndex={-1}>
                <Button variant='outline' className='w-full' onClick={onDelete}>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir Bloqueio</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <Button variant='outline' autoFocus className='w-full mt-1' onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}
