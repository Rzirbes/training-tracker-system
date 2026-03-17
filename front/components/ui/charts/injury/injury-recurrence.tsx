'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Skeleton } from '../../skeleton'

interface RecurrenceEntry {
  type: string
  total: number
}

interface Props {
  data: RecurrenceEntry[]
  isLoading?: boolean
  title?: string
}

export function RecurrenceChart({ data = [], isLoading = false, title = '🔄 Reincidência de lesões' }: Props) {
  const entries = useMemo(() => Object.values(data), [data])
  const options = useMemo(() => [...new Set(entries.map((d) => d.type))], [entries])
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected(options)
  }, [options])

  const filteredData = useMemo(() => entries.filter((item) => selected.includes(item.type)), [entries, selected])

  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <CardTitle>{title}</CardTitle>
          <MultiSelect
            selected={selected}
            onChange={setSelected}
            options={options.map((value) => ({ label: value, value }))}
          />
        </div>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-72 space-y-4'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray='3 3' stroke='hsla(var(--muted))' />
              <XAxis dataKey='type' />
              <YAxis />
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
              <Bar dataKey='total' fill='hsla(var(--primary))' radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
