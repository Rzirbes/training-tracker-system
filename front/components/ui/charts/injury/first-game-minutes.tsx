'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useState, useMemo, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MultiSelect } from '@/components/ui/multi-select'
import { Skeleton } from '../../skeleton'

interface FirstGameMinutesEntry {
  type: string
  minutos: number
}

interface Props {
  data: FirstGameMinutesEntry[]
  isLoading?: boolean
}

export function FirstGameMinutesChart({ data = [], isLoading = false }: Props) {
  const options = useMemo(() => [...new Set(data.map((d) => d.type))], [data])
  const [selected, setSelected] = useState<string[]>(options)

  const filteredData = useMemo(() => data.filter((item) => selected.includes(item.type)), [data, selected])

  useEffect(() => {
    setSelected((prevSelected) => {
      const stillValid = prevSelected.filter((item) => options.includes(item))
      return stillValid.length > 0 ? stillValid : options
    })
  }, [options])

  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <CardTitle>⏳ Minutos no primeiro jogo x lesão</CardTitle>
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
            <LineChart data={filteredData}>
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
              <Legend />
              <Line
                type='monotone'
                dataKey='minutos'
                stroke='hsla(var(--primary))'
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
