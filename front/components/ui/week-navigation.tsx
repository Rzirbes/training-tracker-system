import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getNextWeek, getPreviousWeek } from '@/lib/dates'

export function WeekNavigation({
  firstDayOfWeek,
  lastDayOfWeek,
  pathname,
  week,
}: {
  week: string
  pathname: string
  firstDayOfWeek: Date
  lastDayOfWeek: Date
}) {
  return (
    <div className='w-full lg:w-fit flex items-center gap-4 bg-gray-100 py-1 px-2 rounded-full h-fit text-base md:text-sm'>
      <Link href={pathname.concat(`?week=${getPreviousWeek(week)}`)} prefetch>
        <button className='p-1 rounded-full bg-white hover:brightness-90'>
          <ArrowLeft size={16} />
        </button>
      </Link>
      <span className='w-full text-center'>
        {firstDayOfWeek.toLocaleDateString('pt-BR')} - {lastDayOfWeek.toLocaleDateString('pt-BR')}
      </span>
      <Link href={pathname.concat(`?week=${getNextWeek(week)}`)} prefetch>
        <button className='p-1 rounded-full bg-white hover:brightness-90'>
          <ArrowRight size={16} />
        </button>
      </Link>
    </div>
  )
}
