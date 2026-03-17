import { useSWR } from "@/lib/swr";
import { serverFetcher } from "@/services";
import type { ISelectOptions } from "@/types";

export async function getCities(state?: string) {
  if (!state) return []

  const url = 'cities?state='.concat(state)
  const { ok, data } = await serverFetcher<{ cities: ISelectOptions[] }>(url, {
    next: {
      tags: [`cities-state-id-${state}`],
    },
  })

  if (!ok) return []
  if (!data) return []
  return data.cities
}

export function useCities(stateId?: string) {
  return useSWR(`cities-state-id-${stateId}`, () => getCities(stateId))
}