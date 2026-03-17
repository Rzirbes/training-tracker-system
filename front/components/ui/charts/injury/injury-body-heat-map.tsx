'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import { Skeleton } from "../../skeleton";

interface Props {
  data: { type: string; total: number }[]
  isLoading?: boolean
  title?: string
}

export function InjuryBodyHeatChart({
  data = [],
  isLoading = false,
  title = '📍 Regiões do corpo mais lesionadas',
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent className='h-60 divide-y-2'>
          {data.map((item) => (
            <div key={item.type} className='flex justify-between text-lg text-muted-foreground py-0.5'>
              <span>{item.type}</span>
              <span className='font-semibold text-primary'>{item.total}x</span>
            </div>
          ))}
        </CardContent>
      </Skeleton>
    </Card>
  )
}