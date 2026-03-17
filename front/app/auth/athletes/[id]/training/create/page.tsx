'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Edit, Plus, Save } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteEnum } from '@/enums'
import { serverFetcher } from '@/services'
import { useAuthContext } from '@/contexts'
import { Badge, Button, Details, Form, Skeleton, useToast, WellBeingSummary } from '@/components/ui'
import { buildingRouteWithId, getWeekNumberFromDate } from '@/lib/utils'
import { IRecoveryFormProps, RecoveryFormModal } from '../../../_components/recovery-form'
import { TrainingTemplate, type ITrainingFormProps } from '@/components/templates'
import { useDayWellBeing } from '@/hooks'

export default function CreateTraining() {
  const router = useRouter()
  const params = useParams()
  const query = useSearchParams()
  const { toast } = useToast()
  const { isAdmin } = useAuthContext()

  const athleteId = params.id as string
  const actionText = 'Cadastrar'

  const defaultValues = buildingDefaultValues()
  const redirectRoute = isAdmin ? buildingRouteWithId(RouteEnum.TRAININGS, athleteId) : RouteEnum.AUTHENTICATED

  const form = useForm<ITrainingFormProps>({
    resolver: zodResolver(TrainingTemplate.schema),
    defaultValues,
  })

  const { isSubmitting } = form.formState

  const trainingDate = form.watch('date')

  const wellBeing = useDayWellBeing(athleteId, trainingDate)

  async function onSubmit(data: ITrainingFormProps) {
    if (isSubmitting) return

    const res = await serverFetcher('trainings', {
      method: 'POST',
      body: JSON.stringify({ ...data, athleteUuid: params.id }),
    })
    if (!res.ok) {
      toast({
        title: res.data?.title || 'Erro ao atualizar a carga semanal!',
        description: res.data?.message || 'Verifique e tente novamente...',
        variant: 'destructive',
      })
      form.setError('serverError', {})
      return
    }

    toast({
      title: res.data?.message || 'Treino cadastrado com sucesso!',
      variant: 'success',
    })

    form.reset()
    const week = getWeekNumberFromDate(data.date)
    router.replace(redirectRoute.concat(`?week=${week}`), { scroll: true })
  }

  function buildingDefaultValues() {
    const defaultDate = query.get('date')
    const defaultDescription = query.get('description')
    const defaultType = query.get('trainingTypeUuid')
    const defaultDuration = query.get('duration')
    const defaultTrainingPlanning = query.get('trainingPlanningUuid')
    return {
      date: defaultDate ? new Date(defaultDate) : undefined,
      duration: defaultDuration ? Number(defaultDuration) : undefined,
      description: defaultDescription ?? undefined,
      trainingTypeUuid: defaultType ?? undefined,
      trainingPlanningUuid: defaultTrainingPlanning ?? undefined,
    }
  }

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
                date={trainingDate}
                athleteId={athleteId as string}
                onSuccess={() => wellBeing.mutate()}
                id={wellBeing.data.id}
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
      <section className='w-full'>
        <Form {...form}>
          <TrainingTemplate.Form type='create' athleteId={params.id as string} onSubmit={onSubmit} />
        </Form>
      </section>
      <footer className='flex flex-row justify-end w-full gap-4'>
        <Link href={redirectRoute} scroll={true}>
          <Button variant='outline' disabled={isSubmitting}>
            Cancelar
          </Button>
        </Link>
        <Button
          title={actionText}
          form='training'
          className='w-fit'
          type='submit'
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {!isSubmitting && <Save size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
