import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Skeleton } from '../skeleton'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string
  children: ReactNode
  titleComponent?: ReactNode
  isLoading?: boolean
}

export function ChartWrapper({ title, titleComponent, children, className, isLoading = false, ...props }: Props) {
  return (
    <Card
      className={cn(
        'w-full h-full min-w-[60vw] relative [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:min-h-[600px] [&_canvas]:min-w-[60vw]',
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle>{titleComponent ?? title}</CardTitle>
      </CardHeader>
      <Skeleton isLoaded={!isLoading}>
        <CardContent>{children}</CardContent>
      </Skeleton>
    </Card>
  )
}
