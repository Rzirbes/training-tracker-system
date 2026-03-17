'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
  toast
} from '@/components/ui'
import { mask } from '@/utils/mask'
import { serverFetcher } from '@/services'

export type ICountryFormProps = z.input<typeof countrySchema>
export type ICountryFormOutputProps = z.output<typeof countrySchema>

interface Props {
  onSuccess(id: string): void
  onCancel(): void
}

const countrySchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }).default(''),
})

export function CountryForm({ onCancel, onSuccess }: Props) {
  const countryForm = useForm({
    resolver: zodResolver(countrySchema),
  })

  async function onSubmit(data: ICountryFormProps) {
    const res = await serverFetcher<{ id: string; title?: string; message: string }>('countries', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      toast({
        title: res.data?.title,
        description: res.data.message,
        variant: 'success',
      })
      onSuccess(res.data.id)
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
        <DialogTitle className='flex flex-col gap-1 mt-3'>Cadastro de País</DialogTitle>
        <DialogDescription>Preencha as informações a seguir.</DialogDescription>
      </DialogHeader>
      <form id='country' onSubmit={countryForm.handleSubmit(onSubmit)}>
        <Form {...countryForm}>
          <FormField
            control={countryForm.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do País</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder='Digite o nome completo. ex: Costa Rica...'
                    onChange={(e) =>
                      countryForm.setValue('name', mask.name(e.target?.value), {
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
          <div className='flex gap-4 justify-between items-center pt-6'>
            <Button variant='outline' type='button' onClick={onCancel}>
              Cancelar
            </Button>
            <Button type='submit' form='country' isLoading={countryForm.formState.isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      </form>
    </DialogContent>
  )
}
