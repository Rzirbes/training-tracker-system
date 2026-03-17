'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
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
} from '@/components/ui'
import { getFirstAndLastDayOfWeek } from '@/lib/dates'
import { startOfDay, subDays } from 'date-fns'

interface Props {
  onSubmit(data: ITrainingPlanningFormProps): void
}

export type ITrainingPlanningFormProps = z.input<typeof trainingPlanningSchema>

const timeSchema = z.object({
  start: z
    .string({ required_error: 'Horário de início é obrigatório' })
    .time({ message: 'Hora de início inválida' }),
  end: z
    .string({ required_error: 'Horário de fim é obrigatório' })
    .time({ message: 'Hora de fim inválida' }),
})

export const trainingPlanningSchema = z
  .object({
    date: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data do Treino é obrigatória' : defaultError,
      }),
    }),
    trainingTypeUuid: z
      .string()
      .min(1, { message: 'Tipo de Treino é obrigatório' })
      .default(''),
    description: z.string().optional(),
    duration: z.coerce
      .number()
      .min(1, { message: 'Duração do Treino é obrigatória' })
      .default(0),
    pse: z.coerce
      .number()
      .min(0, { message: 'PSE Planejado é obrigatório' })
      .default(0),
    shouldSchedule: z.boolean().default(false),
    coachId: z.string().optional(),
    time: timeSchema.optional(),
    serverError: z.string().default('').optional(),
  })
  .refine(
    (data) => {
      if (data.shouldSchedule) return !!data.coachId
      return true
    },
    {
      message: 'Treinador é obrigatório ao agendar treino.',
      path: ['coachId'],
    }
  )
  .refine(
    (data) => {
      if (data.shouldSchedule) return !!data.time?.start && !!data.time?.end
      return true
    },
    {
      message: 'Horário de início e fim são obrigatórios ao agendar treino.',
      path: ['time'],
    }
  )
  .refine(
    (data) => {
      if (data.shouldSchedule && data.time) {
        return data.time.end > data.time.start
      }
      return true
    },
    {
      message: 'Horário de fim não pode ser anterior ao de início.',
      path: ['time.end'],
    }
  )
  .transform(({ date, trainingTypeUuid, description, duration, pse, shouldSchedule, coachId, time }) => ({
    date,
    trainingTypeUuid,
    description,
    duration,
    pse,
    shouldSchedule,
    coachId,
    time,
  }))


export function TrainingPlanningForm({ onSubmit }: Props) {
  const form = useFormContext<ITrainingPlanningFormProps>()
  const shouldSchedule = form.watch('shouldSchedule')

  const { data: coachList, isLoading: isLoadingCoachList } = useSWR('all-coaches', async () => {
    const response = await serverFetcher<{ id: string; name: string }[]>('coaches/all')
    if (response.ok) return response.data
  })

  const { data: trainingTypes = [], isLoading: isLoadingTrainingTypes } = useSWR('training-types/all', async () => {
    const response = await serverFetcher('training-types/all')
    if (!response.ok) return []
    return response.data.trainingTypes as { label: string; value: string }[]
  })

  const minDate = startOfDay(subDays(new Date(), 7))

  return (
    <form
      id='training-planning'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-6 text-left h-full w-full sm:w-2/3 md:w-2/5 max-w-xl'
    >
      <div className='flex flex-col gap-4 md:gap-3 h-full'>
        <DatePicker
          control={form.control}
          name='date'
          label='Data do Treino'
          disabled={(date) => date < minDate}
        />        {shouldSchedule && (
          <>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="time.start"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Horário de início</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value?.slice(0, 5) || ''}
                        onChange={(e) => field.onChange(e.target.value + ':00')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time.end"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Horário de fim</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        value={field.value?.slice(0, 5) || ''}
                        onChange={(e) => field.onChange(e.target.value + ':00')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='coachId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treinador</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCoachList}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o treinador' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {coachList?.map(({ name, id }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                        {!coachList?.length && <span className='px-2 text-sm'>Nenhuma opção encontrada...</span>}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name='trainingTypeUuid'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Treino</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingTrainingTypes}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o tipo de treino' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainingTypes.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!trainingTypes.length && <span className='px-2 text-sm'>Nenhuma opção encontrada...</span>}
                  </SelectContent>
                </Select>
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
              <FormLabel>{'Descrição'}</FormLabel>
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
        <FormField
          control={form.control}
          name='shouldSchedule'
          render={({ field }) => (
            <FormItem className='flex items-center gap-2'>
              <FormControl>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={field.onChange}
                  className='w-4 h-4'
                />
              </FormControl>
              <FormLabel className='m-0'>Agendar treino?</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </form>
  )
}
