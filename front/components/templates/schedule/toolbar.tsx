'use client'

import moment from 'moment'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { UserRoleEnum } from '@/enums'
import { MultiSelect } from '@/components/ui/multi-select'
import type { ToolbarProps, View } from 'react-big-calendar'
import type { IScheduleCard } from '@/components/templates'

interface Props extends ToolbarProps<IScheduleCard, object> {
  scheduleTraining(): void
  userRole: UserRoleEnum
  athleteList?: { id: string; name: string }[]
  coachList?: { id: string; name: string }[]
  onFilterChange(filters: { athleteIds?: string[]; coachIds?: string[] }): void
  appliedFilters: { athleteIds?: string[]; coachIds?: string[] }
}

export function ScheduleToolbar({
  date,
  onNavigate,
  view,
  onView,
  scheduleTraining,
  userRole,
  athleteList = [],
  coachList = [],
  onFilterChange,
  appliedFilters = { athleteIds: [], coachIds: [] },
}: Props) {
  const [{ startDate, endDate }, set] = useState({
    startDate: moment(date).startOf('week').toDate(),
    endDate: moment(date).endOf('week').toDate(),
  })

  const handlePrev = () => {
    if (startDate && endDate) {
      set({
        startDate: moment(startDate)
          .subtract(1, view as 'week' | 'day')
          .toDate(),
        endDate: moment(endDate)
          .subtract(1, view as 'week' | 'day')
          .toDate(),
      })
      onNavigate('PREV')
    }
  }

  const handleNext = () => {
    if (startDate && endDate) {
      set({
        startDate: moment(startDate)
          .add(1, view as 'week' | 'day')
          .toDate(),
        endDate: moment(endDate)
          .add(1, view as 'week' | 'day')
          .toDate(),
      })
      onNavigate('NEXT')
    }
  }

  const fullDateDisplay = date.toLocaleDateString('pt-BR', {
    dateStyle: 'full',
  })

  const fullDates = `${startDate?.toLocaleDateString('pt-BR')} - ${endDate?.toLocaleDateString('pt-BR')}`

  const display = {
    day: fullDateDisplay.slice(0, 1).toUpperCase().concat(fullDateDisplay.slice(1)),
    week: fullDates,
    month: fullDates,
  } as Record<View, string>

  const viewTypes = [
    { label: 'Dia', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Mês', value: 'month' },
  ]

  return (
    <div className='w-full flex flex-wrap gap-4 justify-between items-center mb-4'>
      <div className='w-full sm:w-fit flex justify-center items-center gap-4 bg-muted text-foreground py-1 px-2 rounded-full h-fit text-sm text-center'>
        <button
          className='p-1 rounded-full bg-background text-foreground hover:brightness-95 transition'
          onClick={handlePrev}
        >
          <ArrowLeft size={16} />
        </button>
        <fieldset>
          <span className='w-full text-center select-none'>{display[view]}</span>
        </fieldset>
        <button
          className='p-1 rounded-full bg-background text-foreground hover:brightness-95 transition'
          onClick={handleNext}
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className='w-full sm:w-fit flex h-full gap-4 items-center flex-wrap'>
        {!!athleteList?.length && (
          <div className='w-full sm:w-fit'>
            <MultiSelect
              placeholder='Filtre atletas'
              options={athleteList.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              selected={appliedFilters.athleteIds ?? []}
              onChange={(athleteIds: string[]) => onFilterChange({ athleteIds })}
            />
          </div>
        )}

        {!!coachList?.length && (
          <div className='w-full sm:w-fit'>
            <MultiSelect
              placeholder='Filtre colaboradores'
              options={coachList.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
              selected={appliedFilters.coachIds ?? []}
              onChange={(coachIds: string[]) => onFilterChange({ coachIds })}
            />
          </div>
        )}

        <div className='w-full sm:w-fit'>
          <Select value={view} onValueChange={(value: View) => onView(value)}>
            <SelectTrigger className='gap-2'>
              <SelectValue placeholder='Visualização' />
            </SelectTrigger>
            <SelectContent>
              {viewTypes.map(({ label, value }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {userRole === UserRoleEnum.ADMIN && (
          <div className='w-full sm:w-fit flex gap-2'>
            <Button className='w-full flex items-center gap-2' onClick={scheduleTraining}>
              <Plus size={16} />
              Agendar treino
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
