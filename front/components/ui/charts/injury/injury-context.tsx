'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/components/ui'

interface Props {
  data: {
    type: string
    total: number
  }[]
  isLoading?: boolean
  title?: string
}

const COLORS = [
  'blue',
  'hsla(var(--primary))',
  'hsla(var(--chart-2))',
  'hsla(var(--chart-4))',
  'hsla(var(--chart-5))',
  'hsla(var(--chart-3))',
]

export function InjuryContextChart({ data = [], isLoading = false, title = '⚠️ Momento de ocorrência das Lesões' }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                dataKey='total'
                nameKey='type'
                cx='50%'
                cy='50%'
                innerRadius={20}
                outerRadius='80%'
                label={false}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Skeleton>
    </Card>
  )
}
