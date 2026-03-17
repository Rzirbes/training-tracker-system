'use client'

import { useState } from 'react'
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip } from 'recharts'
import { ChartWrapper } from './wrapper'
import { MultiSelect } from '../multi-select'

interface Props {
  labels: string[]
  psr: number[]
  pse: number[]
  plannedTraining: number[]
  performedTraining: number[]
  isLoading?: boolean
}

const seriesOptions = [
  { label: 'Carga Planejada', value: 'Carga Planejada' },
  { label: 'Carga Realizada', value: 'Carga Realizada' },
  { label: 'PSR', value: 'PSR' },
  { label: 'PSE', value: 'PSE' },
]

export function DailyLoadChart({
  labels = [],
  psr,
  pse,
  plannedTraining,
  performedTraining,
  isLoading = false,
}: Props) {
  const [selectedKeys, setSelectedKeys] = useState(seriesOptions.map((opt) => opt.value))

  const chartData = labels.map((label, index) => ({
    name: label,
    'Carga Planejada': plannedTraining[index] ?? 0,
    'Carga Realizada': performedTraining[index] ?? 0,
    PSR: psr[index] ?? 0,
    PSE: pse[index] ?? 0,
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
          <span>📆 Carga diária</span>
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
          <Legend wrapperStyle={{ color: '#6B7280' }} />
          {selectedKeys.includes('Carga Planejada') && (
            <Bar yAxisId='left' dataKey='Carga Planejada' fill='hsla(var(--primary-night))' radius={[8, 8, 0, 0]} />
          )}
          {selectedKeys.includes('Carga Realizada') && (
            <Bar yAxisId='left' dataKey='Carga Realizada' fill='hsla(var(--primary))' radius={[8, 8, 0, 0]} />
          )}
          {selectedKeys.includes('PSR') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='PSR'
              stroke='hsla(var(--chart-5))'
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedKeys.includes('PSE') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='PSE'
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
