'use client'

import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { startTransition, useLayoutEffect } from 'react'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { useSWR } from '@/lib/swr'
import { buildingRouteWithId, getWeekNumberFromDate } from '@/lib/utils'
import { Button, Form, useToast, Spinner } from '@/components/ui'
import { TrainingPlanningTemplate, type ITrainingPlanningFormProps } from '@/components/templates'

export default function UpdateTrainingPlanning() {
  const router = useRouter()
  const { id: athleteId = '', child_id: trainingId = '' } = useParams()
  const { toast } = useToast()

  const { data, isLoading: isLoading } = useSWR(['training-planning', trainingId], async () => {
    if (!trainingId) return
    const response = await serverFetcher<
      Omit<ITrainingPlanningFormProps, 'trainingTypeUuid'> & { trainingType: { id: string; name: string } }
    >('training-planning/'.concat(trainingId as string))
    if (response.ok) return response.data
  })

  const form = useForm<ITrainingPlanningFormProps>({
    resolver: zodResolver(TrainingPlanningTemplate.schema),
    defaultValues: { ...data, trainingTypeUuid: data?.trainingType.id },
  })

  async function onSubmit(data: ITrainingPlanningFormProps) {
    const res = await serverFetcher('training-planning', {
      method: 'PUT',
      body: JSON.stringify({ ...data, trainingUuid: trainingId }),
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
    } else {
      const week = getWeekNumberFromDate(data.date)
      form.reset({})
      router.replace(buildingRouteWithId(RouteEnum.TRAINING_PLANNING, athleteId as string).concat(`?week=${week}`), {
        scroll: true,
      })
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }

  useLayoutEffect(() => {
    if (data) {
      const { date, duration, pse, trainingType, description } = data
      form.reset({
        date,
        duration,
        pse,
        trainingTypeUuid: trainingType.id,
        ...(description !== null && { description }),
      })
    }
    return () => {
      form.reset({})
    }
  }, [data])

  const actionText = 'Editar'

  return (
    <div className='flex flex-col justify-center h-full gap-5'>
      <header>
        <span className='flex gap-4'>
          <h1 className='text-xl md:text-lg font-semibold'>{actionText} Planejamento de Treino</h1>
          {isLoading && <Spinner />}
        </span>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {actionText.toLowerCase()} o planejamento de treino do atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <TrainingPlanningTemplate.Form onSubmit={onSubmit} />
      </Form>
      <footer className='flex flex-row justify-between py-4  w-full md:w-4/5 xl:w-2/5 '>
        <Link href={buildingRouteWithId(RouteEnum.TRAININGS, athleteId as string)} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form='training-planning'
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
          disabled={!form.formState.isDirty}
        >
          {!form.formState.isSubmitting && <Edit size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
