'use client'

import { useMemo, useState, useEffect } from 'react'
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MultiSelect } from '../../multi-select'
import { Skeleton } from '../../skeleton'

interface Props {
  data: { type: string; total: number }[]
  isLoading?: boolean
}

export function InjuryTypeChart({ data = [], isLoading = false }: Props) {
  const uniqueTypes = useMemo(() => Array.from(new Set(data.map((d) => d.type))), [data])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const filteredData = useMemo(() => {
    return data.filter((d) => selectedTypes.includes(d.type))
  }, [data, selectedTypes])

  const options = uniqueTypes.map((type) => ({
    label: type,
    value: type,
  }))

  useEffect(() => {
    setSelectedTypes(uniqueTypes)
  }, [uniqueTypes])

  return (
    <Card className='col-span-1 md:col-span-2 lg:col-span-1'>
      <CardHeader>
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <CardTitle className='flex gap-2 items-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path
                fill='red'
                d='M11.246 16.657a1 1 0 0 0 1.508 0l3.57-4.101A2.75 2.75 0 1 0 12 9.168a2.75 2.75 0 1 0-4.324 3.388z'
              />
              <path d='M17 3h2a2 2 0 0 1 2 2v2' />
              <path d='M21 17v2a2 2 0 0 1-2 2h-2' />
              <path d='M3 7V5a2 2 0 0 1 2-2h2' />
              <path d='M7 21H5a2 2 0 0 1-2-2v-2' />
            </svg>
            Tipos de lesões
          </CardTitle>
          <MultiSelect options={options} selected={selectedTypes} onChange={setSelectedTypes} />
        </div>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-60'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={filteredData}>
              <PolarGrid />
              <PolarAngleAxis dataKey='type' />
              <Radar dataKey='total' fill='hsla(var(--primary))' fillOpacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsla(var(--background))',
                  borderColor: 'hsla(var(--border))',
                  color: 'hsla(var(--foreground))',
                }}
                labelStyle={{ color: 'hsla(var(--primary))' }}
                itemStyle={{ color: 'hsla(var(--foreground))' }}
                cursor={{ fill: 'hsla(var(--muted))' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
