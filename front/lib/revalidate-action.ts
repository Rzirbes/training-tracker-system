'use server'

import { revalidateTag } from 'next/cache'

export default async function revalidateAction(name: string) {
  revalidateTag(name)
}
