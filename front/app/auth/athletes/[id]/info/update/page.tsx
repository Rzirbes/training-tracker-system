'use client'

import Link from 'next/link'
import { startTransition } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { buildingRouteWithId } from '@/lib/utils'
import { useAthleteContext } from '@/contexts/athlete'
import { Form, useToast, Button, Spinner } from '@/components/ui'
import { AthleteTemplate, type IAthleteFormProps } from '@/components/templates'
import { createFormData } from '@/utils'
import type {  IPageProps } from '@/types'

export default function UpdateAthlete({ params }: IPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const actionTitle = 'Editar'
  const athleteURL = 'athletes/'.concat(id)

  const context = useAthleteContext()

  const form = useForm<IAthleteFormProps>({
    resolver: zodResolver(AthleteTemplate.schema),
    defaultValues: {
      ...context?.athlete,
      clubs: context?.athlete?.clubs?.map((data) => ({ ...data, current: !data.endDate })),
      positions: context.athlete?.positions,
    },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: IAthleteFormProps) {
    const formData = createFormData(data)
    const res = await serverFetcher<{ id: string; title?: string; message: string; field?: 'cpf' | 'email' }>(athleteURL, {
      method: 'PUT',
      body: formData,
    })

    if (res.ok) {
      context.mutate()
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
      router.replace(buildingRouteWithId(RouteEnum.MONITORY, id), { scroll: true })
    } else {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
        if (res.status === 409) {
          if (res.data?.field === 'email') {
            form.setError('email', { message: res.data.title })
            form.setFocus('email')
          }

          if (res.data?.field === 'cpf') {
            form.setError('cpf', { message: res.data.title })
            form.setFocus('cpf')
          }
        } else {
          form.setError('serverError', {})
        }
      })
    }
  }

  return (
    <div className='flex flex-col justify-center w-full gap-1 relative h-full'>
      <header className='flex flex-col gap-0.5'>
        <span className='flex gap-4'>
          <h1 className='text-xl md:text-lg font-semibold'>{actionTitle} atleta</h1>
          {context.isLoading && <Spinner />}
        </span>
        <p className='text-lg md:text-base text-balance'>
          Preencha os campos a seguir para {actionTitle.toLowerCase()} o seu atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <div>
          <AthleteTemplate.Form onSubmit={onSubmit} type='update' />
        </div>
      </Form>
      <footer className='flex flex-row justify-between mb-4 w-full gap-8 sm:w-2/3 md:w-3/6'>
        <Link href={buildingRouteWithId(RouteEnum.DETAIL_ATHLETE, id)} className='w-fit' tabIndex={-1}>
          <Button type='button' variant='outline'>
            Cancelar
          </Button>
        </Link>
        <Button
          form='athlete'
          className='w-fit'
          type='submit'
          isLoading={isSubmitting}
          disabled={!form.formState.isDirty || isSubmitting}
        >
          {!isSubmitting && <Save size={20} />}
          {actionTitle}
        </Button>
      </footer>
    </div>
  )
}
