'use server'

import { serverFetcher } from '@/services'
import { TrainingTypeFormProps } from './_schema'

export async function submitTrainingType(route: string, data: TrainingTypeFormProps, method: 'PUT' | 'POST') {
  return serverFetcher(route, {
    method,
    body: JSON.stringify(data),
  })
}
