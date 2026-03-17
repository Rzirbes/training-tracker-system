'use client'

import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { CalendarCheck, CalendarX2, ClipboardCheck, Lock } from 'lucide-react'
import { selectRangeFormat } from '@/components/compositions/schedule/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui'
import type { View } from 'react-big-calendar'
import { useScreenDetector } from '@/hooks'

interface Props {
  training?: IScheduleCard
  blocked?: IScheduleCardBlock
  openTraining(training: IScheduleCard): void
  openBlock?(block: IScheduleCardBlock): void
  view: View
  className?: HTMLButtonElement['className']
}

export type ScheduleItemType = 'SCHEDULE' | 'BLOCK_TIME'

export type IScheduleItem = IScheduleCard | IScheduleCardBlock

export interface IScheduleCardBlock {
  type: ScheduleItemType
  id: string
  start: Date
  end: Date
  description?: string
  trainer: {
    id: string
    name: string
    color: string
  }
}

export interface IScheduleCard {
  type: ScheduleItemType
  id: string
  start: Date
  end: Date
  confirmed: boolean
  canceled: boolean
  completed: boolean
  athlete: {
    id: string
    name: string
  }
  trainer: {
    id: string
    name: string
    color: string
  }
  trainingPlanning: {
    id: string
    pse: number
    duration: number
    description?: string
    trainingType: {
      id: string
      name: string
    }
  }
}

export function ScheduleCard(props: Props) {
  const { training, blocked } = props

  if (training) return <TrainingCardInner {...props} training={training} />
  if (blocked) return <BlockedCardInner {...props} blocked={blocked} />

  return null
}

/* ============================
   Card de AGENDAMENTO (padrão)
   ============================ */
function TrainingCardInner({
  training,
  openTraining,
  view,
  className,
}: Required<Pick<Props, 'training' | 'openTraining' | 'view'>> & Pick<Props, 'className'>) {
  const { isMobile } = useScreenDetector()
  const { start, end, athlete, trainer, confirmed, canceled, trainingPlanning, completed } = training
  const date = selectRangeFormat({ start, end })
  const formattedStartTime = date.split('-')[0]?.trim() ?? ''
  const divider = ' | '
  const labels = { athlete: athlete.name, trainer: trainer.name }

  const title = date
    .concat(divider)
    .concat(canceled ? 'Agendamento cancelado' : '')
    .concat(canceled ? divider : '')
    .concat(trainingPlanning.trainingType.name)
    .concat(divider)
    .concat(labels.athlete)
    .concat(divider)
    .concat(labels.trainer)

  const detailed = getIsDetailed()

  function getIsDetailed() {
    if (view === 'day') return true
    if (view === 'month' || isMobile) return false
    return !isWithin30Minutes()
  }

  function isWithin30Minutes() {
    const diffMs = Math.abs(start.getTime() - end.getTime())
    return diffMs / (1000 * 60) <= 30
  }

  function getBackgroundColor() {
    if (completed) return 'hsla(var(--primary))'
    if (canceled) return 'gray'
    return trainer.color
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => openTraining(training)}
          className={twMerge(
            'text-white rounded-sm text-xs flex flex-col font-normal justify-start text-left h-full p-1.5 w-full z-[70]',
            className
          )}
          style={{
            backgroundColor: getBackgroundColor(),
            border: '1px solid hsla(var(--background))',
            borderRadius: '10px',
          }}
        >
          <div className='flex gap-x-2 flex-wrap'>
            <p className='line-clamp-1 text-ellipsis'>
              {formattedStartTime} - {trainingPlanning.trainingType.name}
            </p>
            {detailed && (
              <Fragment>
                <p className='line-clamp-1 text-ellipsis'>{labels.athlete}.</p>
                <p className='line-clamp-1 text-ellipsis'>{labels.trainer}.</p>
              </Fragment>
            )}
          </div>
          <div className='flex gap-1 justify-end pb-1 pr-1'>
            {canceled && <CalendarX2 className='self-end size-4 mt-1' />}
            {confirmed && <CalendarCheck className='self-end size-4 mt-1' />}
            {completed && <ClipboardCheck className='self-end size-4 mt-1' />}
          </div>
        </TooltipTrigger>
        <TooltipContent className='z-[80]'>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/* ============================
   Card de BLOQUEIO DE AGENDA
   ============================ */
function BlockedCardInner({
  blocked,
  view,
  className,
  openBlock,
}: Required<Pick<Props, 'blocked' | 'view'>> & Pick<Props, 'className' | 'openBlock'>)  {
  const { isMobile } = useScreenDetector()
  const { start, end, trainer, description } = blocked

  // formato: dd/mm HH:MM
  const fmt = (d: Date) =>
    `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

  const rangeShort = `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`

  const detailed = (() => {
    if (view === 'day') return true
    if (view === 'month' || isMobile) return false
    const diffMs = Math.abs(start.getTime() - end.getTime())
    return diffMs / (1000 * 60) > 30
  })()

  const divider = ' | '
  const title =
    ['Bloqueio de agenda', `Treinador: ${trainer.name}`, `Início: ${fmt(start)}`, `Fim: ${fmt(end)}`, description ? `Descrição: ${description}` : '']
      .filter(Boolean)
      .join(divider)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          data-type='BLOCK_TIME'
          onClick={() => openBlock?.(blocked)}
          className={twMerge(
            'text-white rounded-sm text-xs flex flex-col font-normal justify-start text-left h-full p-1.5 w-full z-[70] select-none',
            className
          )}
          style={{
            backgroundColor: 'orange',
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0, rgba(0,0,0,0.12) 10px, rgba(0,0,0,0.22) 10px, rgba(0,0,0,0.22) 20px)',
            border: '1px dashed hsla(var(--background))',
            borderRadius: '10px',
          }}
        >
          <div className='flex gap-x-2 flex-wrap items-center'>
            {/* linha principal sempre visível */}
            <p className='line-clamp-1 text-ellipsis'>
              {rangeShort} — Bloqueado
            </p>

            {/* detalhes conforme view */}
            {detailed && (
              <Fragment>
                <p className='line-clamp-1 text-ellipsis'>Treinador: {trainer.name}.</p>
                {description ? <p className='line-clamp-1 text-ellipsis'>Descrição: {description}</p> : null}
              </Fragment>
            )}
          </div>

          <div className='flex gap-1 justify-end pb-1 pr-1'>
            <Lock className='self-end size-4 mt-1' />
          </div>
        </TooltipTrigger>

        <TooltipContent className='z-[80]'>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

