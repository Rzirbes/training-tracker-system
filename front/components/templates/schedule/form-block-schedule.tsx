'use client'

import { z } from 'zod'
import { useForm, SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { startTransition } from 'react'
import { useSWR } from '@/lib/swr'
import { clientFetcher, serverFetcher } from '@/services'
import { revalidateAction } from '@/lib'
import { getSevenDaysAgo, setDateWithTime } from '@/lib/utils'

import {
  Button,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
  Combobox,
} from '@/components/ui'

/** --------- Types & Schema ---------- */

interface Props {
  onCancel(): void
  defaultValues?: Partial<ScheduleBlockFormInput>
  type?: 'create' | 'update'
}

/**
 * Form (input) → Payload (output via .transform):
 * - coachId → trainerId
 * - date + time → date: { start, end }
 */
const scheduleBlockSchema = z
  .object({
    id: z.string().optional(),
    date: z.coerce.date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Dia é obrigatório' : defaultError,
      }),
    }),
    time: z.object({
      start: z.string({ required_error: 'Início é obrigatório' }).time({ message: 'Hora de início inválida' }),
      end: z.string({ required_error: 'Fim é obrigatório' }).time({ message: 'Hora do fim inválida' }),
    }),
    coachId: z.string().min(1, { message: 'Treinador é obrigatório' }).default(''),
    description: z
      .string()
      .min(3, { message: 'Descrição é obrigatória (mín. 3 caracteres)' })
      .max(300, { message: 'Máx. 300 caracteres' }),
    serverError: z.string().optional().default(''),
  })
  .refine(
    (data) => {
      const start = setDateWithTime(data.date, data.time.start)
      const end = setDateWithTime(data.date, data.time.end)
      return end > start
    },
    { message: 'Fim não pode ser anterior ao início', path: ['time.end'] }
  )
  .refine(
    (data) => {
      const start = setDateWithTime(data.date, data.time.start)
      const sevenDaysAgo = getSevenDaysAgo()
      return start > sevenDaysAgo
    },
    { message: 'Início não pode ser anterior à hora atual', path: ['time.start'] }
  )
  .transform(({ id, date, time, coachId, description }) => {
    const start = setDateWithTime(date, time.start)
    const end = setDateWithTime(date, time.end)

    return {
      id,
      coachId,
      description,
      start,
      end,
    }
  })

type ScheduleBlockSchema = typeof scheduleBlockSchema
type ScheduleBlockFormInput = z.input<ScheduleBlockSchema>
type ScheduleBlockPayload = z.output<ScheduleBlockSchema>

type BlockUpdateResponse = {
  description?: string
  date: { start: string | Date; end: string | Date }
  trainer: { id: string; name: string; color: string }
}

const typeMapper = {
  create: { titles: { head: 'Novo bloqueio de horário', submit: 'Bloquear horário' } },
  update: { titles: { head: 'Atualizar bloqueio', submit: 'Atualizar bloqueio' } },
}

export function ScheduleBlockForm({ defaultValues, onCancel, type = 'create' }: Props) {
  const form = useForm<ScheduleBlockFormInput>({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(scheduleBlockSchema),
    mode: 'onChange',
  })

  const { titles } = typeMapper[type]
  const isSubmitting = form.formState.isSubmitting

  const { data: coachList } = useSWR('all-coaches', async () => {
    const res = await clientFetcher<{ id: string; name: string }[]>('coaches/all')
    return res.ok ? res.data : []
  })

  async function onSubmitForm(payload: ScheduleBlockPayload) {
    const idForRoute = payload.id ?? defaultValues?.id
    const isUpdate = type === 'update' && !!idForRoute
    const route = isUpdate ? `schedule/block-time/${idForRoute}` : 'schedule/block-time'
    const method = isUpdate ? 'PUT' : 'POST'

    try {
      const response = await serverFetcher(route, {
        method,
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        revalidateAction('schedules')

        const successTitle =
          'title' in (response.data as any)
            ? (response.data as any).title
            : isUpdate
            ? 'Bloqueio atualizado'
            : 'Bloqueio criado'
        const successMsg =
          'message' in (response.data as any)
            ? (response.data as any).message
            : isUpdate
            ? 'As alterações foram salvas.'
            : 'Bloqueio registrado com sucesso.'

        toast({ title: successTitle, description: successMsg, variant: 'success' })
        onCancel()
        return
      }

      if (response.status === 409) {
        startTransition(() => {
          form.setError('time.start' as any, { type: 'server', message: 'Conflito de agenda' })
          form.setError('time.end' as any, { type: 'server', message: 'Conflito de agenda' })
          form.setError('coachId', { type: 'server', message: 'Treinador indisponível' })
        })
        toast({ title: 'Conflito de agenda', description: 'Selecione outro horário.', variant: 'destructive' })
        return
      }

      if (response.status === 404) {
        toast({ title: 'Bloqueio não encontrado', description: 'Ele pode ter sido removido.', variant: 'destructive' })
        return
      }

      if (response.status === 422 && (response.data as any)?.errors?.length) {
        ;((response.data as any).errors as Array<{ path?: string; message?: string }>).forEach((e) => {
          if (!e.path) return
          form.setError(e.path as any, { type: 'server', message: e.message || 'Campo inválido' })
        })
        toast({ title: 'Campos inválidos', description: 'Revise os campos destacados.', variant: 'destructive' })
        return
      }

      toast({
        title: isUpdate ? 'Erro ao atualizar bloqueio' : 'Erro ao bloquear horário',
        description: (response.data as any)?.message || 'Tente novamente em instantes...',
        variant: 'destructive',
      })
    } catch {
      toast({
        title: 'Ops, ocorreu um erro!',
        description: 'Não foi possível enviar os dados. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className='w-full grid gap-4'
        onSubmit={form.handleSubmit((data) => onSubmitForm(data as unknown as ScheduleBlockPayload))}
        noValidate
      >
        <h1 className='text-lg font-bold mb-2'>{titles.head}</h1>

        {/* Banner de erro geral */}
        {form.formState.errors.serverError?.message && (
          <div role='alert' className='rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm'>
            {form.formState.errors.serverError.message}
          </div>
        )}

        {/* Data */}
        <DatePicker
          label='Dia'
          name='date'
          control={form.control}
          disabled={(d) => d < getSevenDaysAgo()}
          isDisabled={isSubmitting as any}
        />

        {/* Horários */}
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
                    onChange={(e) => field.onChange(e.target.value + ':00')}
                    aria-invalid={!!form.formState.errors.time?.start}
                    disabled={isSubmitting}
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
                    onChange={(e) => field.onChange(e.target.value + ':00')}
                    aria-invalid={!!form.formState.errors.time?.end}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Treinador */}
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
                  options={(coachList || []).map(({ id, name }) => ({ label: name, value: id }))}
                  placeholder='Selecione o treinador'
                  className='w-full'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do bloqueio</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder='Ex.: Reunião interna / Indisponível / Folga'
                  aria-invalid={!!form.formState.errors.description}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ações */}
        <div className='grid gap-2'>
          <Button type='submit' isLoading={isSubmitting} className='w-full' disabled={isSubmitting}>
            {titles.submit}
          </Button>
          <Button type='button' variant='outline' onClick={onCancel} className='w-full' disabled={isSubmitting}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}
