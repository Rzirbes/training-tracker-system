'use client'

import {
  FirstGameMinutesChart,
  InjuryBodyHeatChart,
  InjuryBodySideChart,
  InjuryContextChart,
  InjuryDegreeChart,
  InjuryTypeChart,
  RecoveryTimeByInjuryTypeChart,
  RecurrenceChart,
} from '@/components/ui'
import { useSWR } from '@/lib/swr'

import { serverFetcher } from '@/services'

interface GetInjuryMonitoryProps {
  injuryRecovery: {
    type: string
    dias: number
  }[]
  bodySide: {
    side: string
    total: number
  }[]
  bodyHeatMap: {
    type: string
    total: number
  }[]
  recurrence: {
    type: string
    total: number
  }[]
  firstGameMinutes: {
    type: string
    minutos: number
  }[]
  type: {
    type: string
    total: number
  }[]
  occurredDuring: {
    type: string
    total: number
  }[]
  degree: {
    degree: string
    total: number
  }[]
}

interface Props {
  athleteId: string
  startDate?: Date
  endDate?: Date
}

export function InjuryDashboard({ athleteId, startDate, endDate}: Props) {
  const { data = {} as GetInjuryMonitoryProps, isLoading } = useSWR(
    [`athlete-${athleteId}-injury-dashboard`, startDate, endDate],
    async () => {
      const params = new URLSearchParams({ athleteUuid: athleteId })

      if (startDate) params.set('startDate', startDate.toISOString())
      if (endDate) params.set('endDate', endDate.toISOString())

      const response = await serverFetcher(`monitoring/injury?${params.toString()}`)

      if (response.ok) return response.data as GetInjuryMonitoryProps

      return {
        type: [],
        bodyHeatMap: [],
        bodySide: [],
        degree: [],
        firstGameMinutes: [],
        injuryRecovery: [],
        occurredDuring: [],
        recurrence: [],
      } as GetInjuryMonitoryProps
    }
  )


  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 pb-8'>
      <InjuryTypeChart data={data.type} isLoading={isLoading} />
      <RecoveryTimeByInjuryTypeChart data={data.injuryRecovery} isLoading={isLoading} />
      <InjuryDegreeChart data={data.degree} isLoading={isLoading} />
      <InjuryBodyHeatChart data={data.bodyHeatMap} isLoading={isLoading} />
      <InjuryBodySideChart data={data.bodySide} isLoading={isLoading} />
      <FirstGameMinutesChart data={data.firstGameMinutes} isLoading={isLoading} />
      <RecurrenceChart data={data.recurrence} isLoading={isLoading} />
      <InjuryContextChart data={data.occurredDuring} isLoading={isLoading} />
    </div>
  )
}