'use client'

import Link from 'next/link'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { serverFetcher } from '@/services'
import { Button, Form, useToast } from '@/components/ui'
import { RouteEnum } from '@/enums'
import { buildingRouteWithId, getWeekNumberFromDate, setDateWithTime } from '@/lib/utils'
import { TrainingPlanningTemplate, type ITrainingPlanningFormProps } from '@/components/templates'

export default function CreateTrainingPlanning() {
  const params = useParams()
  const query = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const { id: athleteId = '' } = params

  const title = 'Cadastrar'

  const form = useForm<ITrainingPlanningFormProps>({
    resolver: zodResolver(TrainingPlanningTemplate.schema),
    defaultValues: buildingDefaultValues(),
  })

  async function onSubmit(data: ITrainingPlanningFormProps) {
    const week = getWeekNumberFromDate(data.date)

    if (data.shouldSchedule && data.time && data.coachId) {
      const start = setDateWithTime(data.date, data.time.start)
      const end = setDateWithTime(data.date, data.time.end)

      const res = await serverFetcher('schedule', {
        method: 'POST',
        body: JSON.stringify({
          athleteId: params.id,
          coachId: data.coachId,
          start,
          end,
          trainingPlanning: {
            trainingTypeId: data.trainingTypeUuid,
            description: data.description,
            pse: data.pse,
            duration: data.duration,
          },
        }),
      })

      if (!res.ok) {
        startTransition(() => {
          toast({
            title: res.data?.title || 'Erro ao agendar treino',
            description: res.data?.message || 'Tente novamente mais tarde',
            variant: 'destructive',
          })
          form.setError('serverError', {})
        })
        return
      }

      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    } else {
      const res = await serverFetcher('training-planning', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          athleteUuid: params.id,
        }),
      })

      if (!res.ok) {
        startTransition(() => {
          toast({
            title: res.data?.title || 'Ops parece que ocorreu um erro!',
            description: res.data?.message || 'Tente novamente em instantes...',
            variant: 'destructive',
          })
          form.setError('serverError', {})
        })
        return
      }

      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }

    form.reset({})
    router.replace(buildingRouteWithId(RouteEnum.TRAINING_PLANNING, athleteId as string).concat(`?week=${week}`), {
      scroll: true,
    })
  }

  function buildingDefaultValues() {
    const defaultDate = query.get('date')
    return {
      date: defaultDate ? new Date(defaultDate) : undefined,
    }
  }

  return (
    <section className='flex flex-col justify-center h-full gap-1'>
      <header>
        <h1 className='text-xl md:text-lg font-semibold'>{title} Planejamento de Treino.</h1>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {title.toLowerCase()} o planejamento de treino do atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <TrainingPlanningTemplate.Form onSubmit={onSubmit} />
      </Form>
      <footer className='flex flex-row justify-between py-4 sm:w-2/3 md:w-2/5 max-w-xl'>
        <Link
          href={buildingRouteWithId(RouteEnum.TRAINING_PLANNING, athleteId as string)}
          className='w-fit'
          tabIndex={-1}
        >
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          form='training-planning'
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting && <Save />}
          Salvar
        </Button>
      </footer>
    </section>
  )
}
