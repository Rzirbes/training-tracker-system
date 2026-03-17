'use client'

import Link from 'next/link'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Plus, Trash } from 'lucide-react'
import { useSWR } from '@/lib/swr'
import { serverFetcher } from '@/services'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  DatePicker,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  PseScalePopover,
  PsrScalePopover,
  Textarea,
  Button,
  Details,
  Skeleton,
} from '@/components/ui'
import { InjuryTemplate } from '../injury'
import { RouteEnum } from '@/enums'
import { buildingRouteWithId } from '@/lib/utils'
import { PainTemplate } from '../pain'

interface Props {
  type: 'create' | 'update'
  athleteId: string
  onSubmit(date: ITrainingFormProps): void
  isLoading?: boolean
}

export type ITrainingFormProps = z.input<typeof trainingSchema>

export const trainingSchema = z
  .object({
    date: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data do Treino é obrigatório' : defaultError,
      }),
    }),
    trainingTypeUuid: z
      .string()
      .min(1, {
        message: 'Tipo de Treino é obrigatório',
      })
      .default(''),
    description: z.string().max(2000).optional().default(''),
    duration: z.coerce
      .number()
      .min(1, {
        message: 'Duração do Treino é obrigatório',
      })
      .default(0),
    pse: z.coerce
      .number({ message: 'PSE é obrigatório' })
      .max(10, 'PSE deve ser menor que 10')
      .min(0, 'PSE deve ser maior que 0'),
    psr: z.coerce
      .number({ message: 'PSR é obrigatório' })
      .max(10, 'PSE deve ser menor que 10')
      .min(0, 'PSE deve ser maior que 0'),
    serverError: z.string().default('').optional(),
    trainingPlanningUuid: z.string().default('').optional(),
  })
  .and(InjuryTemplate.schema)
  .and(PainTemplate.schema)
  .transform(({ date, trainingTypeUuid, description, duration, pse, psr, trainingPlanningUuid, injuries, pains }) => ({
    date,
    trainingTypeUuid,
    duration,
    pse,
    psr,
    description,
    trainingPlanningUuid,
    injuries,
    pains,
  }))

export function TrainingForm({ athleteId, onSubmit, type, isLoading = false }: Props) {
  const form = useFormContext<ITrainingFormProps>()

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await serverFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string }[]
  })

  const { control, watch } = form

  const date = watch('date')

  const injuries = useFieldArray({
    control,
    name: 'injuries',
  })

  const pains = useFieldArray({
    control,
    name: 'pains',
  })

  const hasManyInjuries = injuries.fields.length > 1
  const hasManyPains = pains.fields.length > 1

  const actionText = {
    create: 'Cadastrar',
    update: 'Editar',
  }[type]

  return (
    <form
      id='training'
      onSubmit={form.handleSubmit(onSubmit)}
      className='text-left min-h-[340px] w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start justify-start'
    >
      <Details.Root
        open
        className='w-full rounded-xl border bg-background [&[open]>summary_svg]:rotate-180 transition-all'
      >
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title={`${actionText} Treino Concluído.`}
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} o treino do atleta na plataforma.`}
          />
        </Details.Summary>
        <Skeleton isLoaded={!isLoading}>
          <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
            <DatePicker
              autoFocus
              control={form.control}
              name='date'
              label='Data do Treino'
              disabled={(date) => date > new Date()}
            />
            <FormField
              control={form.control}
              name='trainingTypeUuid'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Treino</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTrainingTypes}>
                      <FormControl>
                        <SelectTrigger ref={field.ref}>
                          <SelectValue placeholder='Selecione o tipo de treino' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainingTypes.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                        {!trainingTypes.length && (
                          <span className='px-2 text-lg md:text-sm '>Nenhuma opção encontrada...</span>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='duration'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Duração do treino (minutos)'}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Insira o tempo total do treino...' type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{'Resumo do Treino'}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder='Resumo geral do treino' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='psr'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSR</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Insira a percepção subjetiva de esforço...'
                        type='number'
                        min={0}
                        max={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='psr'
                render={({ field: { value = 0, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <Slider min={0} max={10} value={[value]} onValueChange={onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PsrScalePopover />
            </div>
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='pse'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSE</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Insira a percepção subjetiva de esforço...'
                        type='number'
                        max={10}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pse'
                render={({ field: { value = 0, onChange } }) => (
                  <FormItem>
                    <FormControl>
                      <Slider min={0} max={10} value={[value]} onValueChange={onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PseScalePopover />
            </div>
          </div>
        </Skeleton>
      </Details.Root>

      <div className='flex flex-col gap-4'>
        <Details.Root className='w-full rounded-xl border bg-background [&[open]>summary_svg]:rotate-180 transition-all'>
          <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
            <Details.Header
              title={`${actionText} Dores.`}
              description={`Preencha os campos a seguir para ${actionText.toLowerCase()} informações sobre dores do atleta no dia do treino.`}
            />
          </Details.Summary>
          <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
            <ul className='mb-4 flex flex-col gap-4 md:gap-3 divide-y-2'>
              {pains.fields.map((pain, index) => (
                <li key={pain.id} className='py-4'>
                  <div className='flex gap-4 justify-between'>
                    <p className='text-lg py-2'>Dor muscular {hasManyPains ? `- ${index + 1}` : ''}</p>
                    <Button type='button' className='h-8' variant='ghost' onClick={() => pains.remove(index)}>
                      <Trash className='size-4' />
                    </Button>
                  </div>
                  <PainTemplate.Form index={index} />
                </li>
              ))}
            </ul>
            <div className='w-full flex flex-col gap-2'>
              <Button
                title='Adicionar dor muscular'
                type='button'
                variant='secondary'
                onClick={() => {
                  pains.append({
                    date,
                  } as unknown as ITrainingFormProps['pains'])
                  form.setFocus(`pains.${pains.fields.length}`)
                }}
              >
                <Plus className='size-4 mr-2' />
                Adicionar dor muscular
              </Button>
              <Link href={buildingRouteWithId(RouteEnum.PAINS, athleteId)} target='_blank' rel='noopener noreferrer'>
                <Button type='button' variant='outline' className='w-full'>
                  Ver histórico
                </Button>
              </Link>
            </div>
          </div>
        </Details.Root>
        <Details.Root className='w-full rounded-xl border bg-background [&[open]>summary_svg]:rotate-180 transition-all'>
          <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
            <Details.Header
              title={`${actionText} Lesões.`}
              description={`Preencha os campos a seguir para ${actionText.toLowerCase()} informações sobre lesões do atleta no dia do`}
            />
          </Details.Summary>
          <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
            <ul className='mb-4 flex flex-col gap-4 md:gap-3 divide-y-2'>
              {injuries.fields.map((injury, index) => (
                <li key={injury.id} className='py-4'>
                  <div className='flex gap-4 justify-between'>
                    <p className='text-lg py-2'>Lesão {hasManyInjuries ? `- ${index + 1}` : ''}</p>
                    <Button type='button' className='h-8' variant='ghost' onClick={() => injuries.remove(index)}>
                      <Trash className='size-4' />
                    </Button>
                  </div>
                  <InjuryTemplate.Form index={index} />
                </li>
              ))}
            </ul>
            <div className='w-full flex flex-col gap-2'>
              <Button
                title='Adicionar lesão'
                type='button'
                variant='secondary'
                onClick={() => {
                  injuries.append({
                    date,
                  } as unknown as ITrainingFormProps['injuries'])
                  form.setFocus(`injuries.${injuries.fields.length}`)
                }}
              >
                <Plus className='size-4 mr-2' />
                Adicionar lesão
              </Button>
              <Link href={buildingRouteWithId(RouteEnum.INJURIES, athleteId)} target='_blank' rel='noopener noreferrer'>
                <Button type='button' variant='outline' className='w-full'>
                  Ver histórico
                </Button>
              </Link>
            </div>
          </div>
        </Details.Root>
      </div>
    </form>
  )
}
