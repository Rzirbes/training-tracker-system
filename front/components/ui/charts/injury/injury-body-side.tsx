'use client'

import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts'
import { FlipHorizontal2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '../../skeleton'

interface Props {
  data: { side: string; total: number }[]
  isLoading?: boolean
  title?: string
}

export function InjuryBodySideChart({ data = [], isLoading = false, title = 'Lesões por lado do corpo' }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 items-center'>
          <FlipHorizontal2 />
          {title}
        </CardTitle>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey='side' />
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
