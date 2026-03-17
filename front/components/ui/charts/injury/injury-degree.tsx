'use client'

import { useMemo, useState, useEffect } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { MultiSelect } from '../../multi-select'
import { Skeleton } from '../../skeleton'

interface Props {
  data: { degree: string; total: number }[]
  isLoading?: boolean
}

export function InjuryDegreeChart({ data = [], isLoading = false}: Props) {
  const uniqueDegrees = useMemo(() => Array.from(new Set(data.map((d) => d.degree))), [data])

  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([])
  
  const filteredData = useMemo(() => {
    return data.filter((d) => selectedDegrees.includes(d.degree))
  }, [data, selectedDegrees])

  const options = uniqueDegrees.map((degree) => ({
    label: degree,
    value: degree,
  }))
  
  useEffect(() => {
    setSelectedDegrees(uniqueDegrees)
  }, [uniqueDegrees])
  
  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <CardTitle>🔬 Distribuição por grau de lesão</CardTitle>
          <MultiSelect options={options} selected={selectedDegrees} onChange={setSelectedDegrees} />
        </div>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-60'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={filteredData} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' stroke='hsla(var(--muted))' />
              <XAxis type='number' />
              <YAxis type='category' dataKey='degree' width={150} />
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
              <Bar dataKey='total' fill='hsla(var(--primary))' radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
