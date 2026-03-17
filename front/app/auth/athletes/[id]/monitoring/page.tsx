'use client'

import { ChangeEvent, startTransition, useEffect, useMemo } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowLeft, ArrowRight, Info, Printer } from 'lucide-react'
import { serverFetcher } from '@/services'
import { useSWR } from '@/lib/swr'
import { InjuryDashboard, PainDashboard } from '@/components/compositions'
import {
  Button,
  DailyLoadChart,
  WeekLoadChart,
  WellBeingChart,
  DailyDurationChart,
  Input,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
  WeekNavigator,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import {
  getCurrentWeekDates,
  getNextWeek,
  getPreviousWeek,
  getWeekDatesFromInput,
  getWeekNumberFromDate,
} from '@/lib/utils'

interface WeekMonitoringResponseDto {
  days: Date[]
  PSRs: number[]
  durations: {
    planned: number[]
    performed: number[]
  }
  trainings: {
    planned: number[]
    performed: number[]
  }
  PSEs: {
    planned: number[]
    performed: number[]
  }
}

interface MonotonyMonitoringResponseDto {
  week: string[]
  monotony: number[]
  strain: number[]
  acuteChronicLoadRatio: number[]
  load: {
    planned: number[]
    performed: number[]
  }
  risks: ({
    title: string
    description: string
    warning: boolean
  } | null)[]
}

interface GetWellBeingMonitoringResponseDto {
  days: Date[]
  sleep: number[]
  sleepHours: number[]
  energy: number[]
  pain: number[]
  stress: number[]
  humor: number[]
  nutrition: number[]
  waterIntake: number[]
  motivation: number[]
  fatigue: number[]
}

export default function Monitoring() {
  const { id = '' } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const pathname = usePathname()
  const router = useRouter()
  const currentDay = new Date()
  const week = searchParams.get('week') ?? getWeekNumberFromDate(currentDay)
  const weekDates = week ? getWeekDatesFromInput(week) : getCurrentWeekDates()

  const firstDayOfWeek = weekDates[0]
  const lastDayOfWeek = weekDates[6]

  const {
    data: weekMonitoring,
    isLoading: isLoadingWeekMonitoring,
    mutate: mutateWeekMonitoring,
  } = useSWR(['monitoring-week', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await serverFetcher(
      `monitoring/week?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (!response.ok) {
      const defaultValue: number[] = []
      return {
        days: [] as Date[],
        PSRs: defaultValue,
        durations: { performed: defaultValue, planned: defaultValue },
        PSEs: { performed: defaultValue, planned: defaultValue },
        trainings: { performed: defaultValue, planned: defaultValue },
      } as WeekMonitoringResponseDto
    }
    return response.data as WeekMonitoringResponseDto
  })

  const {
    data: monotonyMonitoring = {} as MonotonyMonitoringResponseDto,
    isLoading: isLoadingMonotony,
    mutate: mutateMonotony,
  } = useSWR(['monitoring-monotony', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await serverFetcher(
      `monitoring/monotony?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (!response.ok) {
      const defaultValue: number[] = []
      return {
        week: [],
        risks: [],
        monotony: defaultValue,
        strain: defaultValue,
        acuteChronicLoadRatio: defaultValue,
        load: {
          planned: defaultValue,
          performed: defaultValue,
        },
      }
    }
    return response.data as MonotonyMonitoringResponseDto
  })

  const {
    data: wellBeingMonitoring = {} as GetWellBeingMonitoringResponseDto,
    isLoading: isLoadingWellBeingMonitoring,
    mutate: mutateWellBeingMonitoring,
  } = useSWR(['well-being-week-monitory', firstDayOfWeek, lastDayOfWeek, id], async () => {
    const response = await serverFetcher(
      `monitoring/well-being?startDate=${firstDayOfWeek.toISOString()}&endDate=${lastDayOfWeek.toISOString()}&athleteUuid=${id}`
    )
    if (response.ok) return response.data as GetWellBeingMonitoringResponseDto

    return {
      days: [],
      sleep: [],
      sleepHours: [],
      energy: [],
      pain: [],
      stress: [],
      humor: [],
      nutrition: [],
      motivation: [],
      waterIntake: [],
      fatigue: [],
    } as GetWellBeingMonitoringResponseDto
  })

  const isLoading = isLoadingWellBeingMonitoring || isLoadingMonotony || isLoadingWeekMonitoring

  const { labels, pse, psr, duration, performedTraining, plannedDuration, plannedPse, plannedTraining } =
    useMemo(() => {
      if (!weekMonitoring) {
        return {
          labels: [],
          pse: [],
          plannedPse: [],
          psr: [],
          performedTraining: [],
          plannedTraining: [],
          duration: [],
          plannedDuration: [],
        }
      }

      const labels = weekMonitoring.days.map((day) => new Date(day).toLocaleDateString('pt-BR'))

      return {
        labels,
        pse: weekMonitoring.PSEs.performed,
        plannedPse: weekMonitoring.PSEs.planned,
        psr: weekMonitoring.PSRs,
        performedTraining: weekMonitoring.trainings.performed,
        plannedTraining: weekMonitoring.trainings.planned,
        duration: weekMonitoring.durations.performed,
        plannedDuration: weekMonitoring.durations.planned,
      }
    }, [weekMonitoring])

  function setWeek(week: string) {
    if (week) params.set('week', week)
    else params.delete('week')
    router.push(pathname.concat('?').concat(params.toString()))
  }

  function handlePreviousWeek() {
    setWeek(getPreviousWeek(week))
  }

  function handleNextWeek() {
    setWeek(getNextWeek(week))
  }

  function handleWeekInput(e: ChangeEvent<HTMLInputElement>) {
    const week = e.target.value
    setWeek(week)
  }

  useEffect(() => {
    startTransition(() => {
      mutateMonotony()
      mutateWeekMonitoring()
      mutateWellBeingMonitoring()
    })
  }, [])

  return (
    <section className='w-full h-full flex flex-col gap-6 print:gap-4'>
      <div className='flex flex-col lg:flex-row gap-4 items-center mb-2 w-full justify-between'>
        <div className='flex gap-4 items-center w-ful flex-col lg:flex-row w-full'>
          <Input type='week' className='print:hidden w-full lg:max-w-44' onChange={handleWeekInput} value={week} />
          <WeekNavigator
            firstDayOfWeek={firstDayOfWeek}
            lastDayOfWeek={lastDayOfWeek}
            handler={{
              previous: handlePreviousWeek,
              next: handleNextWeek,
            }}
          />
          {isLoading && <Spinner />}
        </div>
        <Button
          className='bg-secondary text-foreground px-10 w-full lg:w-fit print:hidden'
          onClick={() => window?.print()}
        >
          <Printer /> Imprimir
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='py-4 flex gap-2 items-center'>
            Controle de carga
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>
                  Monitoramento de carga entre as semanas até o dia {lastDayOfWeek.toLocaleDateString('pt-BR')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-6'>
            {!!monotonyMonitoring?.risks?.length && (
              <ul className='flex flex-col gap-2'>
                {monotonyMonitoring?.risks.map(
                  (risk) =>
                    risk && (
                      <li key={risk.title}>
                        <Alert className='h-full' variant={risk.warning ? 'destructive' : 'default'}>
                          <AlertCircle size={20} />
                          <AlertTitle>{risk.title}</AlertTitle>
                          <AlertDescription>{risk.description}</AlertDescription>
                        </Alert>
                      </li>
                    )
                )}
              </ul>
            )}
            <WeekLoadChart isLoading={isLoadingMonotony} {...monotonyMonitoring} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='py-2 flex gap-2 items-center'>
            Monitoramento semanal
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>
                  {`Monitoramento semanal do dia ${firstDayOfWeek.toLocaleDateString('pt-BR')} até o dia
              ${lastDayOfWeek.toLocaleDateString('pt-BR')}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <DailyLoadChart
            isLoading={isLoadingWeekMonitoring}
            {...{ labels, psr, pse, plannedTraining, performedTraining }}
          />
          <DailyDurationChart
            isLoading={isLoadingWeekMonitoring}
            {...{ labels, pse, plannedPse, duration, plannedDuration }}
          />
          <WellBeingChart {...{ labels, ...wellBeingMonitoring }} isLoading={isLoadingWellBeingMonitoring} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='py-4 flex gap-2 items-center'>
            Monitoramento de Lesões
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>
                  Monitoramento de Lesões até o dia {lastDayOfWeek.toLocaleDateString('pt-BR')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InjuryDashboard athleteId={id as string} endDate={lastDayOfWeek} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className='py-4 flex gap-2 items-center'>
            Monitoramento de Dores
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>
                  Monitoramento de Dores até o dia {lastDayOfWeek.toLocaleDateString('pt-BR')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PainDashboard athleteId={id as string} endDate={lastDayOfWeek} />
        </CardContent>
      </Card>
    </section>
  )
}
