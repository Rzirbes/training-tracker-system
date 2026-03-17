import { useSWR } from "@/lib/swr";
import { serverFetcher } from "@/services";
import type { ISelectOptions } from "@/types";

export async function getStates(country?: string) {
  if (!country) return [] as ISelectOptions[]

  const url = 'states?countryId='.concat(country)
  const { ok, data } = await serverFetcher<{ states: ISelectOptions[] }>(url, {
    next: {
      tags: ['states-select-option'],
    },
  })

  if (!ok) return [] as ISelectOptions[]
  if (!data) return [] as ISelectOptions[]
  return data.states
}


export function useStates(countryId?: string) {
  return useSWR(`states-country-id-${countryId}`, () => getStates(countryId))
}