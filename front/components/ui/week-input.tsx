'use client'

import type { ChangeEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Input } from '@/components/ui'

export function WeekInput({ defaultValue }: { defaultValue: string }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleWeekInput(e: ChangeEvent<HTMLInputElement>) {
    const week = e.target.value
    if (!week) router.push(pathname)
    router.push(pathname.concat(`?week=${week}`))
  }

  return <Input type='week' className='w-full lg:max-w-44' value={defaultValue} onChange={handleWeekInput} />
}
