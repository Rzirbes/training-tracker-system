'use client'

import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { startTransition, useEffect, useLayoutEffect } from 'react'
import { Edit, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { useSWR } from '@/lib/swr'
import { buildingRouteWithId, getWeekNumberFromDate } from '@/lib/utils'
import { Button, Form, useToast, Details, Badge, WellBeingSummary, Skeleton } from '@/components/ui'
import { TrainingTemplate, type ITrainingFormProps } from '@/components/templates'
import { IRecoveryFormProps, RecoveryFormModal } from '@/app/auth/athletes/_components/recovery-form'
import { useDayWellBeing } from '@/hooks'

interface TrainingProps extends Omit<ITrainingFormProps, 'trainingTypeUuid'> {
  trainingType: { id: string; name: string }
}

export default function UpdateTraining() {
  const router = useRouter()
  const { id: athleteId = '', child_id: trainingId = '' } = useParams()
  const { toast } = useToast()

  const endpoint = `trainings/${trainingId}`

  const { data, isLoading: isLoading } = useSWR([endpoint, trainingId], async () => {
    if (!trainingId) return
    const response = await serverFetcher<TrainingProps>(endpoint)
    if (response.ok) {
      form.reset({
        ...response.data,
        date: new Date(response.data.date),
        trainingTypeUuid: response.data.trainingType.id,
      })
      return response.data
    }
  })

  const form = useForm<ITrainingFormProps>({
    resolver: zodResolver(TrainingTemplate.schema),
    defaultValues: { ...data, trainingTypeUuid: data?.trainingType.id },
  })

  const trainingDate = form.watch('date')

  const wellBeing = useDayWellBeing(athleteId as string, trainingDate)

  async function onSubmit(data: ITrainingFormProps) {
    const res = await serverFetcher('trainings', {
      method: 'PUT',
      body: JSON.stringify({ ...data, athleteUuid: athleteId, id: trainingId }),
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
      form.reset({})
      const week = getWeekNumberFromDate(data.date)
      router.replace(buildingRouteWithId(RouteEnum.TRAININGS, athleteId as string).concat(`?week=${week}`), {
        scroll: true,
      })
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }

  const actionText = 'Editar'

  return (
    <div className='flex flex-col justify-center h-full gap-5'>
      <Details.Root className='w-full rounded-xl border bg-background [&[open]>summary_svg]:rotate-180 transition-all'>
        <Details.Summary>
          <div>
            <h3 className='text-xl md:text-lg font-semibold'>Avaliação de Bem-Estar</h3>
            <p className='text-lg md:text-base text-balance'>
              Informações de bem-estar do atleta no dia do treinamento.
            </p>
          </div>
        </Details.Summary>
        <Skeleton isLoaded={!wellBeing.isLoading}>
          <div className='p-4 pt-0 flex flex-col gap-1'>
            {!!wellBeing.summary?.length && (
              <RecoveryFormModal
                id={wellBeing.data.id}
                date={trainingDate}
                athleteId={athleteId as string}
                onSuccess={() => wellBeing.mutate()}
                defaultValues={Object.entries(wellBeing.data).reduce((acc, [key, { value }]) => {
                  acc[key as keyof IRecoveryFormProps] = String(value)
                  return acc
                }, {} as IRecoveryFormProps)}
              >
                <Badge variant='secondary' className='w-fit flex gap-1'>
                  <Edit className='size-3' />
                  Editar
                </Badge>
              </RecoveryFormModal>
            )}
            {!trainingDate ? (
              <Badge variant='secondary' className='w-fit flex gap-1'>
                Selecione a data do treino
              </Badge>
            ) : (
              <div className='flex flex-col md:flex-row gap-4'>
                <WellBeingSummary
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 text-sm w-full'
                  summary={wellBeing.summary}
                />
                {!wellBeing.summary?.length && (
                  <RecoveryFormModal
                    date={trainingDate}
                    athleteId={athleteId as string}
                    onSuccess={() => wellBeing.mutate()}
                  >
                    <Badge className='w-fit flex gap-1'>
                      <Plus className='size-3' />
                      Informar
                    </Badge>
                  </RecoveryFormModal>
                )}
              </div>
            )}
          </div>
        </Skeleton>
      </Details.Root>
      <Form {...form}>
        <TrainingTemplate.Form
          type='update'
          athleteId={athleteId as string}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </Form>
      <footer className='flex flex-row justify-between py-4 w-full '>
        <Link href={buildingRouteWithId(RouteEnum.TRAININGS, athleteId as string)} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form='training'
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
