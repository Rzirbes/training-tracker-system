'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useSWR } from '@/lib/swr'
import { serverFetcher } from '@/services'
import {
  Badge,
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PseScalePopover,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  DialogContent,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  MultiSelect,
  Combobox,
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { calculateTimeDifferenceInMinutes, cn, getSevenDaysAgo, setDateWithTime } from '@/lib/utils'
import { startTransition, useEffect, useMemo } from 'react'
import { revalidateAction } from '@/lib'
import { mask } from '@/lib/mask'
import { useAuthContext, useDialogContext } from '@/contexts'
import { ScheduleBlockForm } from './form-block-schedule'

interface Props {
  onCancel(): void
  defaultValues?: Pick<IScheduleFormSchema, 'date' | 'time' | 'hasRecurrence' | 'recurrence' | 'trainingTypeId'>
  type?: 'create' | 'update'
}

export type IScheduleFormSchema = z.input<typeof scheduleSchema>

enum TabEnum {
  SCHEDULE,
  TRAINING,
  RECURRENCE,
}

const DAYS_OF_WEEK = [
  { label: 'Domingo', value: 'SUNDAY' },
  { label: 'Segunda-feira', value: 'MONDAY' },
  { label: 'Terça-feira', value: 'TUESDAY' },
  { label: 'Quarta-feira', value: 'WEDNESDAY' },
  { label: 'Quinta-feira', value: 'THURSDAY' },
  { label: 'Sexta-feira', value: 'FRIDAY' },
  { label: 'Sábado', value: 'SATURDAY' },
]

export const scheduleSchema = z
  .object({
    date: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Dia do Treino é obrigatório' : defaultError,
      }),
    }),
    time: z.object({
      start: z
        .string({
          message: 'Início é obrigatório',
        })
        .time({
          message: 'Hora de início inválida',
        }),
      end: z
        .string({
          message: 'Fim é obrigatório',
        })
        .time({
          message: 'Hora do fim inválida',
        }),
    }),
    athleteId: z
      .string()
      .min(1, {
        message: 'Atleta é obrigatório',
      })
      .default(''),
    coachId: z
      .string()
      .min(1, {
        message: 'Treinador é obrigatório',
      })
      .default(''),
    trainingTypeId: z
      .string()
      .min(1, {
        message: 'Tipo de Treino é obrigatório',
      })
      .default(''),
    description: z.string().optional(),
    duration: z.coerce
      .number()
      .min(1, {
        message: 'Duração do Treino é obrigatório',
      })
      .default(0),
    pse: z.coerce
      .number()
      .min(0, {
        message: 'PSE Planejado é obrigatório',
      })
      .default(0),
    serverError: z.string().default('').optional(),
    tab: z.number().default(TabEnum.SCHEDULE),
    id: z.string().optional(),
    hasRecurrence: z.boolean().default(false),
    recurrence: z
      .object({
        days: z.array(z.string()).optional(),
        sessions: z.coerce.number().optional().default(1),
      })
      .optional(),
  })
  .refine(
    (data) => {
      const start = setDateWithTime(data.date, data.time.start)
      const end = setDateWithTime(data.date, data.time.end)
      return end > start
    },
    {
      message: 'Fim não pode ser anterior ao início',
      path: ['time.end'],
    }
  )
  .refine(
    (data) => {
      const start = setDateWithTime(data.date, data.time.start)
      const sevenDaysAgo = getSevenDaysAgo()
      return start > sevenDaysAgo
    },
    {
      message: 'Início não pode ser anterior à hora atual',
      path: ['time.start'],
    }
  )
  .refine(
    (data) => {
      if (!data.hasRecurrence) return true
      return !!data.recurrence?.days?.length
    },
    {
      message: 'Selecione pelo menos um dia da semana para a recorrência',
      path: ['recurrence.days'],
    }
  )
  .refine(
    (data) => {
      if (!data.hasRecurrence) return true
      return !!data.recurrence?.sessions
    },
    {
      message: 'Sessão de recorrência deve ser no mínimo 1',
      path: ['recurrence.sessions'],
    }
  )
  .transform(
    ({ id, date, athleteId, coachId, time, trainingTypeId, description, pse, duration, hasRecurrence, recurrence }) => {
      const start = setDateWithTime(date, time.start)
      const end = setDateWithTime(date, time.end)

      const transformedData: any = {
        id,
        athleteId,
        coachId,
        start,
        end,
        trainingPlanning: {
          trainingTypeId,
          description,
          duration,
          pse,
        },
      }

      if (hasRecurrence && recurrence?.days && recurrence?.sessions) {
        transformedData.recurrence = {
          days: recurrence.days,
          sessions: recurrence.sessions,
        }
      }

      return transformedData
    }
  )

const typeMapper = {
  create: {
    disableAthleteInput: false,
    titles: {
      head: 'Novo agendamento',
      submit: 'Agendar',
    },
  },
  update: {
    disableAthleteInput: true,
    titles: {
      head: 'Atualizar agendamento',
      submit: 'Atualizar agendamento',
    },
  },
}

export function ScheduleForm({ defaultValues, onCancel, type = 'create' }: Props) {
  const form = useForm<IScheduleFormSchema>({
    defaultValues: {
      ...defaultValues,
      hasRecurrence: defaultValues?.hasRecurrence || false,
      recurrence: defaultValues?.recurrence || { days: [], sessions: 1 },
      tab: TabEnum.SCHEDULE,
    },
    resolver: zodResolver(scheduleSchema),
    mode: 'onChange',
  })

const { dialog } = useDialogContext()
  

  const start = form.watch('time.start')
  const end = form.watch('time.end')
  const hasRecurrence = form.watch('hasRecurrence')
  const currentTab = form.watch('tab')

  const { titles } = typeMapper[type]

  const { data: coachList, isLoading: isLoadingCoachList } = useSWR('all-coaches', async () => {
    const response = await serverFetcher<{ id: string; name: string }[]>('coaches/all')
    if (response.ok) return response.data
    return []
  })

  const { data: athleteList, isLoading: isLoadingAthleteList } = useSWR('all-athletes', async () => {
    const response = await serverFetcher<{ id: string; name: string }[]>('athletes/all')
    if (response.ok) return response.data
    return []
  })

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await serverFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string; isDefault: boolean }[]
  })

  async function onNext() {
    const fields = ['date', 'time', 'athleteId', 'coachId', 'hasRecurrence']

    if (currentTab === TabEnum.SCHEDULE) {
      const validate = await form.trigger(fields as (keyof IScheduleFormSchema)[], {
        shouldFocus: true,
      })
      if (validate) return setTab(hasRecurrence ? TabEnum.RECURRENCE : TabEnum.TRAINING)
    }

    if (currentTab === TabEnum.RECURRENCE) {
      fields.push('recurrence', 'recurrence.days', 'recurrence.sessions')
      const validate = await form.trigger(fields as (keyof IScheduleFormSchema)[], {
        shouldFocus: true,
      })
      if (validate) return setTab(TabEnum.TRAINING)
    }
  }

  function setTab(value: TabEnum) {
    form.setValue('tab', value)
  }

  function handleOpenBlockForm() {
    const values = form.getValues()
    const blockDefaults = {
      date: values.date,
      time: values.time,
      coachId: values.coachId,
      description: '',
      hasRecurrence: values.hasRecurrence,
      recurrence: values.recurrence
    }
    dialog.current?.open(
      <DialogContent className='max-w-lg'>
        <ScheduleBlockForm
          defaultValues={blockDefaults}
          onCancel={dialog.current.close}
          type='create'
        />
      </DialogContent>
    )
  }

  async function onSubmit({ id = '', ...body }: IScheduleFormSchema) {
    const route = 'schedule/'.concat(id)

    try {
      const response = await serverFetcher<{
        title: string
        message: string
        conflict?: { coach: boolean; athlete: boolean }
      }>(route, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(body),
      })
      if (response.ok) {
        revalidateAction('schedules')
        toast({
          title: response.data.title,
          description: response.data.message,
          variant: 'success',
        })
        onCancel()
      } else {
        if (response.status === 409) {
          startTransition(() => {
            form.setValue('tab', TabEnum.SCHEDULE)
            form.setError('time.start', { type: 'manual', message: 'Conflito de agenda' })
            form.setError('time.end', { type: 'manual', message: 'Conflito de agenda' })
            form.setFocus('time.start')

            if (response.data?.conflict?.athlete)
              form.setError('athleteId', { type: 'manual', message: 'Conflito de agenda' })

            if (response.data?.conflict?.coach)
              form.setError('coachId', { type: 'manual', message: 'Conflito de agenda' })
          })
        }
        toast({
          title: response.data?.title || 'Ops parece que ocorreu um erro!',
          description: response.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Ops parece que ocorreu um erro!',
        description: 'Não foi possível enviar o agendamento. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const defaultTrainingType = useMemo(() => trainingTypes.find(({ isDefault }) => isDefault), [trainingTypes])

  useEffect(() => {
    if (!defaultTrainingType || defaultValues?.trainingTypeId) return
    form.setValue('trainingTypeId', defaultTrainingType.value)
  }, [defaultTrainingType])

  return (
    <Form {...form}>
      <form className='w-full grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className='text-lg font-bold mb-2'>{titles.head}</h1>
        <Button type='button' variant='secondary' onClick={handleOpenBlockForm}>
          Bloquear horário na agenda
        </Button>
        <Tabs value={currentTab?.toString()}>
          <TabsList className={cn('grid grid-cols-2', hasRecurrence && 'grid-cols-3')}>
            <TabsTrigger className='md:w-full text-center' value={TabEnum.SCHEDULE.toString()}>
              <button type='button' onClick={() => setTab(TabEnum.SCHEDULE)}>
                Agendar para
              </button>
            </TabsTrigger>
            {hasRecurrence && (
              <TabsTrigger className='md:w-full text-center' value={TabEnum.RECURRENCE.toString()}>
                <button type='button' onClick={() => setTab(TabEnum.RECURRENCE)}>
                  Recorrência
                </button>
              </TabsTrigger>
            )}
            <TabsTrigger className='md:w-full text-center' value={TabEnum.TRAINING.toString()}>
              <button type='button' onClick={() => setTab(TabEnum.TRAINING)}>
                Detalhes do Treino
              </button>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TabEnum.SCHEDULE.toString()} className='w-full grid gap-2'>
            <DatePicker label='Dia' name='date' control={form.control} disabled={(date) => date < getSevenDaysAgo()} />
            <div className='flex gap-2 items-start'>
              <FormField
                control={form.control}
                name='time.start'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Hora de início</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='time'
                        value={field.value?.slice(0, 5) || ''}
                        onChange={(e) => {
                          const timeWithSeconds = e.target.value + ':00'
                          field.onChange(timeWithSeconds)
                          form.setValue('duration', calculateTimeDifferenceInMinutes(timeWithSeconds, end))
                          form.trigger('time')
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='time.end'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Hora do fim</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='time'
                        value={field.value?.slice(0, 5) || ''}
                        onChange={(e) => {
                          const timeWithSeconds = e.target.value + ':00'
                          field.onChange(timeWithSeconds)
                          form.setValue('duration', calculateTimeDifferenceInMinutes(start, timeWithSeconds))
                          form.trigger('time')
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='athleteId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atleta</FormLabel>
                  <FormControl>
                    <Combobox
                      options={
                        athleteList?.map(({ name, id }) => ({
                          label: name,
                          value: id,
                        })) || []
                      }
                      value={field.value}
                      onSelect={field.onChange}
                      placeholder='Selecione o Atleta'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='coachId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treinador</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onSelect={field.onChange}
                      options={
                        coachList?.map(({ name, id }) => ({
                          label: name,
                          value: id,
                        })) || []
                      }
                      placeholder='Selecione o treinador'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === 'create' && (
              <FormField
                control={form.control}
                name='hasRecurrence'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-1 mt-1 mb-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (!checked) {
                            form.resetField('recurrence', {
                              defaultValue: undefined,
                            })
                          }
                        }}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Habilitar recorrência</FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}
            <Button type='button' onClick={onNext}>
              Avançar
            </Button>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
          </TabsContent>
          {hasRecurrence && (
            <TabsContent value={TabEnum.RECURRENCE.toString()} className='w-full grid gap-2'>
              <FormField
                control={form.control}
                name='recurrence.days'
                render={({ field }) => (
                  <FormItem className='flex flex-col gap-1 w-full'>
                    <FormLabel>Dias da semana</FormLabel>
                    <FormControl>
                      <div className='w-full py-1'>
                        <MultiSelect
                          options={DAYS_OF_WEEK}
                          selected={field.value || []}
                          onChange={field.onChange}
                          placeholder='Selecione'
                          className={{
                            trigger: 'md:w-full',
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ul className='flex gap-2 flex-wrap'>
                {form.watch('recurrence.days')?.map((day) => (
                  <li key={day}>
                    <Badge variant='secondary'>{DAYS_OF_WEEK.find(({ value }) => value === day)?.label}</Badge>
                  </li>
                ))}
              </ul>

              <FormField
                control={form.control}
                name='recurrence.sessions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de sessões</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='number'
                        min={1}
                        placeholder='Quantas sessões serão criadas?'
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value, 10))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='button' onClick={onNext}>
                Avançar
              </Button>
              <Button type='button' variant='outline' onClick={onCancel}>
                Cancelar
              </Button>
            </TabsContent>
          )}
          <TabsContent value={TabEnum.TRAINING.toString()} className='w-full grid gap-2'>
            <FormField
              control={form.control}
              name='trainingTypeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Treino</FormLabel>
                  <FormControl>
                    <Combobox
                      options={trainingTypes || []}
                      value={field.value || defaultTrainingType?.value}
                      onSelect={field.onChange}
                      placeholder='Selecione o Tipo de Treino'
                      className='w-full'
                    />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Descreva o treinamento...' />
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
                    <Input {...field} placeholder='Insira o tempo de treino planejado...' type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pse'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PSE Planejado</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Insira a percepção subjetiva de esforço...' type='number' max={10} />
                  </FormControl>
                  <FormMessage />
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
            <Button type='submit' isLoading={form.formState.isSubmitting}>
              {titles.submit}
            </Button>
            <Button type='button' variant='outline' onClick={onCancel}>
              Cancelar
            </Button>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
