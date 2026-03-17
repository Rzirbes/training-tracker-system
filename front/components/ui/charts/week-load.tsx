'use client'

import { useState } from 'react'
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Legend, Bar, Line, CartesianGrid, Tooltip } from 'recharts'
import { ChartWrapper } from './wrapper'
import { MultiSelect } from '../multi-select'

interface Props {
  isLoading?: boolean
  week: string[]
  monotony: number[]
  strain: number[]
  acuteChronicLoadRatio: number[]
  load: {
    planned: number[]
    performed: number[]
  }
}

const seriesOptions = [
  { label: 'Carga Planejada', value: 'Carga Planejada' },
  { label: 'Carga Realizada', value: 'Carga Realizada' },
  { label: 'Tensão', value: 'Tensão' },
  { label: 'Monotonia', value: 'Monotonia' },
  { label: 'Risco Agudo:Crônico', value: 'Risco Agudo:Crônico' },
]

export function WeekLoadChart({ week = [], strain, monotony, load, acuteChronicLoadRatio, isLoading = false }: Props) {
  const [selectedKeys, setSelectedKeys] = useState(seriesOptions.map((opt) => opt.value))

  const chartData = week.map((label, index) => ({
    name: label,
    'Carga Planejada': load.planned[index] ?? 0,
    'Carga Realizada': load.performed[index] ?? 0,
    Tensão: strain[index] ?? 0,
    Monotonia: monotony[index] ?? 0,
    'Risco Agudo:Crônico': acuteChronicLoadRatio[index] ?? 0,
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
          <span>📈 Carga semanal</span>
          <MultiSelect options={seriesOptions} selected={selectedKeys} onChange={setSelectedKeys} />
        </div>
      }
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
            <Bar yAxisId='left' dataKey='Carga Planejada' fill='hsla(var(--chart-1))' radius={[6, 6, 0, 0]} />
          )}
          {selectedKeys.includes('Carga Realizada') && (
            <Bar yAxisId='left' dataKey='Carga Realizada' fill='hsla(var(--primary))' radius={[6, 6, 0, 0]} />
          )}
          {selectedKeys.includes('Tensão') && (
            <Bar yAxisId='left' dataKey='Tensão' fill='hsla(var(--chart-2))' radius={[6, 6, 0, 0]} />
          )}
          {selectedKeys.includes('Monotonia') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='Monotonia'
              stroke='hsla(var(--chart-5))'
              strokeWidth={2}
              dot={false}
            />
          )}
          {selectedKeys.includes('Risco Agudo:Crônico') && (
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='Risco Agudo:Crônico'
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
