"use client"

import Link from 'next/link'
import { Fragment, useMemo } from 'react'
import { CalendarCheck, CalendarClock, CalendarX2, ClipboardCheck, Edit, Trash } from 'lucide-react'
import { capitalizeFirstLetter } from '@/lib/utils'
import { Badge, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'
import { ConfirmDeleteDialog, IScheduleCard } from '@/components/compositions'
import { useAuthContext, useDialogContext } from '@/contexts'
import { RouteEnum, UserRoleEnum } from '@/enums'
import { revalidateAction } from '@/lib'

interface Props {
  userRole: UserRoleEnum
  trainingSchedule: IScheduleCard
  onClose(): void
  onEdit(): void
  onCancel(): void
  onDelete(): void
}

export function ScheduleDetail({ trainingSchedule, onCancel, onClose, onEdit, onDelete, userRole }: Props) {
  const { start, end, confirmed, canceled, athlete, trainer, trainingPlanning, completed } = trainingSchedule
  const { dialog } = useDialogContext()

  const isAdmin = userRole === UserRoleEnum.ADMIN

  const finishTraining = useMemo(() => {
    const trainingParams = new URLSearchParams({
      date: end.toString(),
      trainingPlanningUuid: trainingPlanning.id,
      trainingTypeUuid: trainingPlanning.trainingType.id,
      duration: trainingPlanning.duration.toString(),
      ...(trainingPlanning.description && { description: trainingPlanning.description }),
    })

    return `${RouteEnum.CREATE_TRAINING.replace(':ID', athlete.id)}?${trainingParams.toString()}`
  }, [athlete.id, end, trainingPlanning])

  return (
    <div className='grid grid-cols-1 gap-2'>
      <h1 className='text-lg font-bold mb-2'>Agendamento</h1>
      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Dia</p>
        <p>
          {capitalizeFirstLetter(
            start.toLocaleDateString('pt-BR', {
              dateStyle: 'full',
            })
          )}
        </p>
      </div>
      <div className='grid grid-cols-2'>
        <div className='grid grid-rows-2'>
          <p className='text-sm font-bold'>Hora de início</p>
          <p>
            {start.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className='grid grid-rows-2'>
          <p className='text-sm font-bold'>Hora do fim</p>
          <p>
            {end.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Atleta</p>
        <Link
          href={RouteEnum.MONITORY.replace(':ID', athlete.id)}
          className='text-primary hover:underline'
          onClick={() => dialog.current?.close()}
        >
          {athlete.name}
        </Link>
      </div>
      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>Treinador</p>
        {userRole === UserRoleEnum.ADMIN ? (
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
        <p className='text-sm font-bold'>Tipo de Treino</p>
        {userRole === UserRoleEnum.ADMIN ? (
          <Link
            href={RouteEnum.TRAINING_TYPES}
            className='text-primary hover:underline'
            onClick={() => dialog.current?.close()}
          >
            {trainingPlanning.trainingType.name}
          </Link>
        ) : (
          <p>{trainingPlanning.trainingType.name}</p>
        )}
      </div>
      <div className='grid grid-rows-2'>
        <p className='text-sm font-bold'>PSE Planejada</p>
        <Badge variant='default'>{trainingPlanning.pse}</Badge>
      </div>
      <div className='grid gap-1'>
        <p className='text-sm font-bold'>Status</p>
        {!completed && !canceled && !confirmed && (
          <Badge variant='secondary' className='flex gap-2 items-center'>
            <CalendarClock />
            Aguardando confirmação do atleta
          </Badge>
        )}
        {completed && (
          <Badge className='flex gap-2 items-center'>
            <ClipboardCheck />
            Treino concluído
          </Badge>
        )}
        {(canceled || confirmed) && !completed && (
          <Fragment>
            {canceled && (
              <Badge variant='destructive' className='flex flex-row gap-1'>
                <CalendarX2 />
                Agendamento cancelado
              </Badge>
            )}
            {confirmed && (
              <Badge variant='secondary' className='flex flex-row gap-1'>
                <CalendarCheck />
                Confirmado pelo atleta
              </Badge>
            )}
          </Fragment>
        )}
      </div>
      {!canceled && !completed && isAdmin && (
        <div className='flex gap-2 justify-end'>
          <TooltipProvider>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger className='w-full' tabIndex={-1}>
                <Button variant='outline' className='w-full' onClick={onEdit}>
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar Agendamento</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger className='w-full' tabIndex={-1}>
                <Button variant='outline' className='w-full' onClick={onCancel}>
                  <CalendarX2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancelar Agendamento</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip defaultOpen={false}>
              <TooltipTrigger className='w-full' tabIndex={-1}>
                <Button variant='outline' className='w-full' onClick={onDelete}>
                  <Trash />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Excluir Agendamento</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      {!completed && !canceled && !isAdmin && (
        <Button variant='destructive' className='w-full mt-1' onClick={onCancel}>
          Cancelar Atendimento
        </Button>
      )}
      {!completed && !canceled && (
        <Link href={finishTraining} tabIndex={-1}>
          <Button className='w-full mt-1' onClick={dialog.current?.close}>
            Finalizar Atendimento
          </Button>
        </Link>
      )}
      <Button variant='outline' autoFocus className='w-full mt-1' onClick={onClose}>
        Fechar
      </Button>
    </div>
  )
}
