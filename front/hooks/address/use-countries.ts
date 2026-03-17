import { useSWR } from "@/lib/swr";
import { serverFetcher } from "@/services";
import type { ISelectOptions } from "@/types";

export async function getCountries() {
  const { ok, data } = await serverFetcher<{ countries: ISelectOptions[] }>('countries', {
    next: {
      tags: ['countries-select-option'],
    },
  })
  if (!ok) return <ISelectOptions[]>[] 
  if (!data) return <ISelectOptions[]>[]
  return data.countries
}


export function useCountries() {
  return useSWR('countries', getCountries)
}