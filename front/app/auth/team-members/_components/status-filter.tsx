'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'

interface Props {
    status: string
}

export function StatusFilter({ status }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleChange = (newStatus: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('isEnabled', newStatus)
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    }

    return (
      <Select value={status} onValueChange={handleChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Filtrar por status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Todos</SelectItem>
          <SelectItem value='true'>Ativos</SelectItem>
          <SelectItem value='false'>Inativos</SelectItem>
        </SelectContent>
      </Select>
    )
}
