import { CalendarCheck, CalendarX, RefreshCwOff } from 'lucide-react'
import { Logo } from '@/components/ui'
import { capitalizeFirstLetter, getHelloTextByTime } from '@/lib/utils'
import { serverFetcher } from '@/services'
import { redirect } from 'next/navigation'
import { RouteEnum } from '@/enums'
import type { IPageProps } from '@/types'

export default async function ScheduleResponsePage({ params, searchParams }: IPageProps) {
  const { id } = params
  const { name = 'atleta', type = '' } = searchParams

  if (!id || !type) redirect(RouteEnum.LOGIN)

  const greetingByTime = getHelloTextByTime()
  const schedule = await serverFetcher(`schedule/${id}/${type}/from/athlete`, { method: 'PATCH', auth: false })

  return (
    <section className='w-full flex flex-col h-full justify-start items-center gap-4 p-3 pt-12 md:pt-4'>
      <span className='hidden xl:inline mb-4'>
        <Logo />
      </span>
      <p className='text-foreground text-xl md:text-2xl font-semibold text-balance text-center'>
        {greetingByTime} <span className='text-primary'>{schedule.data.athlete ?? name}!</span>
      </p>
      {schedule.ok ? (
        <div className='flex flex-col gap-3 items-center text-foreground'>
          {type === 'confirm' ? (
            <CalendarCheck className='size-32 stroke-1' />
          ) : (
            <CalendarX className='size-32 stroke-1' />
          )}
          <h1 className='text-primary-night text-lg md:text-xl font-medium text-center text-balance'>
            {'Seu treinamento agendado para '}
            <br />
            <span className='font-semibold text-primary-medium'>{capitalizeFirstLetter(schedule.data.date)}</span>
            <br /> foi <strong>{type === 'confirm' ? 'confirmado' : 'cancelado'}</strong> com sucesso!
          </h1>
        </div>
      ) : (
        <div className='flex flex-col gap-4 items-center'>
          <h1 className='text-primary-night text-lg md:text-xl font-medium text-center text-balance'>
            Parece que ocorreu um erro enquanto buscava-mos o seu agendamento... <br /> Tente novamente em instantes, e
            caso o problema persista contate o seu treinador.
          </h1>
          <RefreshCwOff className='size-28 stroke-1' />
        </div>
      )}
    </section>
  )
}
