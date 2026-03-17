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
  toast,
} from '@/components/ui'
import { useCities, useCountries, useStates } from '@/hooks'
import { mask } from '@/utils/mask'
import { serverFetcher } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type IStateFormProps = z.input<typeof clubSchema>
export type IStateFormOutputProps = z.output<typeof clubSchema>

interface Props {
  onSuccess(data: { country: string; state: string; city: string; club: string }): void
  onCancel(): void
  defaultValues?: IStateFormProps
}

const clubSchema = z.object({
  countryId: z.string().min(1, { message: 'País é obrigatório' }).default(''),
  stateId: z.string().min(1, { message: 'Estado é obrigatório' }).default(''),
  cityId: z.string().min(1, { message: 'Cidade é obrigatório' }).default(''),
  name: z.string().trim().min(1, { message: 'Nome do Clube é obrigatório' }).default(''),
})

export function ClubForm({ onCancel, onSuccess, defaultValues }: Props) {
  const form = useForm({
    resolver: zodResolver(clubSchema),
    defaultValues,
  })

  const countryId = form.watch('countryId')
  const stateId = form.watch('stateId')

  const { data: countries = [], mutate: mutateCountries } = useCountries()
  const { data: states = [], mutate: mutateStates } = useStates(countryId)
  const { data: cities = [], mutate: mutateCities } = useCities(stateId)

  function onChangeCountry() {
    form.resetField('stateId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateStates()
    onChangeState()
  }

  function onChangeState() {
    form.resetField('cityId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateCities()
  }


  async function onSubmit(data: IStateFormProps) {
    const res = await serverFetcher<{ id: string; title?: string; message: string }>('clubs', {
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
        club: res.data.id,
        country: data.countryId!,
        state: data.stateId!,
        city: data.cityId!,
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
        <DialogTitle className='flex flex-col gap-1 mt-3'>Cadastro de Clube</DialogTitle>
        <DialogDescription>Preencha as informações a seguir.</DialogDescription>
      </DialogHeader>
      <form id='club' onSubmit={form.handleSubmit(onSubmit)}>
        <Form {...form}>
          <div className='flex flex-col gap-2.5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Clube</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Digite o nome do clube. ex: Grêmio...'
                      onChange={(e) =>
                        form.setValue('name', mask.clubName(e.target?.value), {
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
              name='cityId'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Cidade</FormLabel>
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
                          <SelectValue placeholder='Selecione a cidade' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                        {!cities.length && (
                          <span className='px-2 text-lg md:text-sm '>Nenhuma cidade encontrada...</span>
                        )}
                      </SelectContent>
                    </Select>
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
            <Button type='submit' form='club' isLoading={form.formState.isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      </form>
    </DialogContent>
  )
}
