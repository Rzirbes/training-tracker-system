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
import { useCountries } from '@/hooks'
import { mask } from '@/utils/mask'
import { serverFetcher } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export type IStateFormProps = z.input<typeof stateSchema>
export type IStateFormOutputProps = z.output<typeof stateSchema>

interface Props {
  onSuccess(data: { state: string; country: string }): void
  onCancel(): void
  defaultValues?: IStateFormProps
}

const stateSchema = z.object({
  countryId: z.string().min(1, { message: 'País é obrigatório' }).default(''),
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }).default(''),
})

export function StateForm({ onCancel, onSuccess, defaultValues }: Props) {
  const form = useForm({
    resolver: zodResolver(stateSchema),
    defaultValues,
  })

  const { data: countries = [] } = useCountries()

  async function onSubmit(data: IStateFormProps) {
    const res = await serverFetcher<{ id: string; title?: string; message: string }>('states', {
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
        state: res.data.id,
        country: data.countryId!
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
        <DialogTitle className='flex flex-col gap-1 mt-3'>Cadastro de Estado</DialogTitle>
        <DialogDescription>Preencha as informações a seguir.</DialogDescription>
      </DialogHeader>
      <form id='state' onSubmit={form.handleSubmit(onSubmit)}>
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Estado</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Digite o nome completo. ex: Rio Grade do Sul...'
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
            <Button type='submit' form='state' isLoading={form.formState.isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      </form>
    </DialogContent>
  )
}
