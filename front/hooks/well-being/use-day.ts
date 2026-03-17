import { useSWR } from "@/lib/swr"
import { serverFetcher } from "@/services"
import type { GetDayWellBeingResponseDto } from "@/types"

// const defaultValue = [] as { title: string; value: number }[]
const defaultValue = {} as GetDayWellBeingResponseDto

export function useDayWellBeing(athleteId: string, date: Date) {
   const { data = defaultValue, ...props } = useSWR(
     [`athlete-$${athleteId}-well-being-${date}`, athleteId, date],
     async () => {
       if (!date) return defaultValue

       const response = await serverFetcher(
         `monitoring/well-being/day?date=${date.toISOString()}&athleteId=${athleteId}`
       )

       if (!response.ok) return defaultValue

      return response.data as GetDayWellBeingResponseDto
      //  return Object.values(wellBeing)
     }
  )
  
  const {id: _, ...summaryData } = data
  
  return { ...props, data: data as typeof defaultValue, summary: Object.values(summaryData) } 
  
}