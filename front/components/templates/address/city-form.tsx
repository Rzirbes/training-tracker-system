'use client'

import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast
} from '@/components/ui'
import { useCountries, useStates } from '@/hooks'
import { mask } from '@/utils/mask'
import { serverFetcher } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type IStateFormProps = z.input<typeof citySchema>
export type IStateFormOutputProps = z.output<typeof citySchema>

interface Props {
  onSuccess(data: { country: string; state: string;  city: string}): void
  onCancel(): void
  defaultValues?: IStateFormProps
}

const citySchema = z.object({
  countryId: z.string().min(1, { message: 'País é obrigatório' }).default(''),
  stateId: z.string().min(1, { message: 'Estado é obrigatório' }).default(''),
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }).default(''),
})

export function CityForm({ onCancel, onSuccess, defaultValues }: Props) {
  const form = useForm({
    resolver: zodResolver(citySchema),
    defaultValues,
  })

  const { data: countries = [] } = useCountries()
  const { data: states = [], mutate: mutateStates } = useStates(form.watch('countryId'))

  function onChangeCountry() {
    mutateStates()
    form.resetField('stateId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
  }

  async function onSubmit(data: IStateFormProps) {
    const res = await serverFetcher<{ id: string; title?: string; message: string }>('cities', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      toast({
        title: res.data?.title,
        description: res.data.message,
        variant: 'success',
      })
      onSuccess({
        city: res.data.id,
        country: data.countryId!,
        state: data.stateId!
      })
    } else {
      toast({
        title: res.data?.title || 'Ops parece que ocorreu um erro!',
        description:
          (Array.isArray(res.data?.message) ? res.data?.message.join(', ').concat('.') : res.data?.message) ||
          'Tente novamente em instantes...',
        variant: 'destructive',
      })
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='flex flex-col gap-1 mt-3'>Cadastro de Cidade</DialogTitle>
        <DialogDescription>Preencha as informações a seguir.</DialogDescription>
      </DialogHeader>
      <form id='city' onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <div className='flex flex-col gap-2.5'>
            <FormField
              control={form.control}
              name='countryId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Select
                      autoComplete='on'
                      value={field.value as unknown as string}
                      onValueChange={(country) => {
                        field.onChange(country)
                        field.onBlur()
                        onChangeCountry()
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue autoFocus placeholder='Selecione o país' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                        {!countries.length && (
                          <span className='px-2 text-lg md:text-sm '>Nenhum país encontrado...</span>
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
              name='stateId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      autoComplete='on'
                      value={field.value as unknown as string}
                      onValueChange={(country) => {
                        field.onChange(country)
                        field.onBlur()
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o estado' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                        {!states.length && (
                          <span className='px-2 text-lg md:text-sm '>Nenhum estado encontrado...</span>
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Cidade</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Digite o nome completo. ex: Arroio do Sal...'
                      onChange={(e) =>
                        form.setValue('name', mask.name(e.target?.value), {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-4 justify-between items-center pt-6'>
            <Button variant='outline' type='button' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' form='city' isLoading={form.formState.isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      </form>
    </DialogContent>
  )
}
