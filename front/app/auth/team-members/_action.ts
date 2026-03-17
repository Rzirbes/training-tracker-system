'use server'

import { serverFetcher } from '@/services'

interface CollaboratorsProps {
  id: string
  name: string
  email: string
  isEnabled: boolean
  role: string
  schedulerColor: string
}

export async function getCoachesAction(page: string, search: string, isEnabled: string) {
  const query = new URLSearchParams({ page, search })

  if (isEnabled === 'all') {
    query.delete('isEnabled')
  } else {
    query.set('isEnabled', isEnabled)
  }

  const response = await serverFetcher(`coaches?${query.toString()}`, {
    method: 'GET',
    next: { tags: ['coaches'] },
  })

  const coaches: CollaboratorsProps[] = response?.data?.data ?? []

  return {
    coaches,
    total: response?.data?.total ?? 0,
    lastPage: response?.data?.lastPage ?? 1,
  }
}
