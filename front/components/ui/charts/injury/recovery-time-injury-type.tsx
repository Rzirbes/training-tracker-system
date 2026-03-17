'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useMemo, useEffect } from 'react'
import { MultiSelect } from '../../multi-select'
import { Skeleton } from '../../skeleton'

interface RecoveryData {
  type: string
  dias: number
}

interface Props {
  data: RecoveryData[]
  isLoading?: boolean
}

export function RecoveryTimeByInjuryTypeChart({ data = [], isLoading = false}: Props) {
  const uniqueTypes = useMemo(() => Array.from(new Set(data.map((item) => item.type))), [data])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const filteredData = useMemo(() => {
    return data.filter((item) => selectedTypes.includes(item.type))
  }, [data, selectedTypes])

  const options = useMemo(() => uniqueTypes.map((type) => ({ label: type, value: type })), [uniqueTypes])

  useEffect(() => {
    setSelectedTypes(uniqueTypes)
  }, [uniqueTypes])

  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <div>
            <CardTitle>📆 Tempo médio de recuperação por tipo de lesão</CardTitle>
            <CardDescription>Tempo médio de recuperação por tipo de lesão</CardDescription>
          </div>
          <MultiSelect options={options} selected={selectedTypes} onChange={setSelectedTypes} />
        </div>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-60'>
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
              <Legend />
              <Bar dataKey='dias' fill='hsla(var(--primary))' radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
