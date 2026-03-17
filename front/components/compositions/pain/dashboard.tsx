'use client'

import {
  InjuryBodyHeatChart,
  InjuryBodySideChart,
  InjuryContextChart,
  RecurrenceChart,
} from '@/components/ui'
import { useSWR } from '@/lib/swr'

import { serverFetcher } from '@/services'

interface GetPainMonitoryProps {
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
  occurredDuring: {
    type: string
    total: number
  }[]
}

interface Props {
  athleteId: string
  startDate?: Date
  endDate?: Date
}

export function PainDashboard({ athleteId, startDate, endDate}: Props) {
  const { data = {} as GetPainMonitoryProps, isLoading } = useSWR(
    [`athlete-${athleteId}-pain-dashboard`, startDate, endDate],
    async () => {
      const params = new URLSearchParams({ athleteUuid: athleteId })

      if (startDate) params.set('startDate', startDate.toISOString())
      if (endDate) params.set('endDate', endDate.toISOString())

      const response = await serverFetcher(`monitoring/pain?${params.toString()}`)

      if (response.ok) return response.data as GetPainMonitoryProps

      return {
        bodyHeatMap: [],
        bodySide: [],
        occurredDuring: [],
        recurrence: [],
      } as GetPainMonitoryProps
    }
  )

  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-3 pb-8'>
      <InjuryBodyHeatChart data={data.bodyHeatMap} isLoading={isLoading} title='📍 Regiões do corpo mais doloridas' />
      <div className='col-span-2'>
        <InjuryBodySideChart data={data.bodySide} isLoading={isLoading} title='Dores por lado do corpo' />
      </div>
      <RecurrenceChart data={data.recurrence} isLoading={isLoading} title='🔄 Reincidência de dores' />
      <InjuryContextChart data={data.occurredDuring} isLoading={isLoading} title='⚠️ Momento de ocorrência das dores' />
    </div>
  )
}