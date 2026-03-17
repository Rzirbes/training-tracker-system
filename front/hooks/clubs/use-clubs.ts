import { useSWR } from "@/lib/swr";
import { serverFetcher } from "@/services";
import type { ISelectOptions } from "@/types";

async function getClubs(city?: string) {
  if (!city) return []

  const url = `clubs?city=${city}`
  const { ok, data } = await serverFetcher<{ clubs: ISelectOptions[] }>(url, {
    next: {
      tags: [`clubs-city-id-${city}`],
    },
  })

  if (!ok) return []
  if (!data) return []
  return data.clubs
}

export function useClubs(cityId?: string) {
  return useSWR(`clubs-city-id-${cityId}`, () => getClubs(cityId))
}