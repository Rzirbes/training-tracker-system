import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  date: Date
  events: unknown[]
}

export function ScheduleShowMore({ events, ...rest }: Props) {
  return (
    <button className='text-sm' {...rest}>
      Ver mais ({events.length})
    </button>
  )
}
