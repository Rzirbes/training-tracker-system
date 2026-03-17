'use client'

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from 'recharts'
import { ChartWrapper } from './wrapper'
import { useState } from 'react'
import { MultiSelect } from '../multi-select'

interface Props {
  labels: string[]
  plannedPse: number[]
  pse: number[]
  duration: number[]
  plannedDuration: number[]
  isLoading?: boolean
}

const seriesOptions = [
  { label: 'Tempo Planejado (min)', value: 'Tempo Planejado (min)' },
  { label: 'Tempo Realizado (min)', value: 'Tempo Realizado (min)' },
  { label: 'PSE Planejado', value: 'PSE Planejado' },
  { label: 'PSE Realizado', value: 'PSE Realizado' },
]

export function DailyDurationChart({ labels, pse, plannedPse, duration, plannedDuration, isLoading = false }: Props) {
  const [selectedKeys, setSelectedKeys] = useState(seriesOptions.map((opt) => opt.value))

  const chartData = labels.map((label, index) => ({
    name: label,
    'Tempo Planejado (min)': plannedDuration[index] ?? 0,
    'Tempo Realizado (min)': duration[index] ?? 0,
    'PSE Planejado': plannedPse[index] ?? 0,
    'PSE Realizado': pse[index] ?? 0,
  }))

  const styles = {
    axis: {
      fontSize: 14,
    },
  }

  return (
    <ChartWrapper
      isLoading={isLoading}
      titleComponent={
        <div className='flex items-center justify-between w-full flex-wrap gap-2'>
          <span>⏱️ Duração Total - (Minutos) x PSE</span>
          <MultiSelect options={seriesOptions} selected={selectedKeys} onChange={setSelectedKeys} />
        </div>
      }
      className='page-break print:mt-16'
    >
      <ResponsiveContainer width='100%' height={350}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' stroke='hsla(var(--muted))' />
          <XAxis dataKey='name' stroke='hsla(var(--foreground))' style={styles.axis} />
          <YAxis yAxisId='left' stroke='hsla(var(--foreground))' style={styles.axis} />
          <YAxis yAxisId='right' orientation='right' stroke='hsla(var(--foreground))' style={styles.axis} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsla(var(--background))',
              borderColor: 'hsla(var(--border))',
              color: 'hsla(var(--foreground))',
            }}
            labelStyle={{ color: 'hsla(var(--primary))' }}
            itemStyle={{ color: 'hsla(var(--foreground))' }}
            cursor={{ fill: 'hsla(var(--primary))' }}
          />
          <Legend wrapperStyle={{ color: 'hsla(var(--foreground))' }} />
          {selectedKeys.includes('Tempo Planejado (min)') && (
            <Bar
              yAxisId='left'
              dataKey='Tempo Planejado (min)'
              fill='hsla(var(--primary-night))'
              radius={[8, 8, 0, 0]}
            />
          )}
          {selectedKeys.includes('Tempo Realizado (min)') && (
            <Bar yAxisId='left' dataKey='Tempo Realizado (min)' fill='hsla(var(--primary))' radius={[8, 8, 0, 0]} />
          )}
          {selectedKeys.includes('PSE Planejado') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='PSE Planejado'
              stroke='hsla(var(--chart-5))'
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedKeys.includes('PSE Realizado') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='PSE Realizado'
              stroke='hsla(var(--chart-6))'
              strokeWidth={2}
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
