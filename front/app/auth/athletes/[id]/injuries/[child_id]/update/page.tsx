'use client'

import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { startTransition, useLayoutEffect } from 'react'
import { Edit } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { useSWR } from '@/lib/swr'
import { buildingRouteWithId } from '@/lib/utils'
import { Button, Form, useToast, Spinner } from '@/components/ui'
import { InjuryTemplate, type InjuryTemplateProps } from '@/components/templates'

type IFormProps = InjuryTemplateProps['InjuryForm']

const formId = 'update-injury-form'

export default function UpdateInjury() {
  const router = useRouter()
  const { id: athleteId = '', child_id: injuryId = '' } = useParams()
  const { toast } = useToast()

  const endpoint = `injuries/${injuryId}`

  const { data, isLoading: isLoading } = useSWR([endpoint, injuryId], async () => {
    if (!injuryId) return

    const response = await serverFetcher<IFormProps['injuries'][number]>(endpoint)

    if (response.ok) {
      form.reset({
        injuries: [response.data],
      })
      return response.data
    }
  })

  const form = useForm<IFormProps>({
    resolver: zodResolver(InjuryTemplate.schema),
    defaultValues: { injuries: [data] },
  })

  async function onSubmit(data: IFormProps) {
    const payload = data.injuries[0]
    const res = await serverFetcher(endpoint, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
        form.setError('serverError', {})
      })
    } else {
      form.reset({})
      router.replace(buildingRouteWithId(RouteEnum.INJURIES, athleteId as string))
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }

  useLayoutEffect(() => {
    !!data && form.reset({ injuries: [data] })
    return () => {
      form.reset({})
    }
  }, [data])

  const actionText = 'Editar'

  return (
    <div className='flex flex-col justify-center h-full gap-5 w-full md:w-4/5 xl:w-2/5'>
      <header>
        <span className='flex gap-4'>
          <h1 className='text-xl md:text-lg font-semibold'>{actionText} Lesão</h1>
          {isLoading && <Spinner />}
        </span>
        <p className='text-lg md:text-base'>
          Preencha os campos a seguir para {actionText.toLowerCase()} a Lesão do atleta na plataforma.
        </p>
      </header>
      <Form {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
          <InjuryTemplate.Form index={0} />
        </form>
      </Form>
      <footer className='flex flex-row justify-between py-4 w-full'>
        <Link href={buildingRouteWithId(RouteEnum.INJURIES, athleteId as string)} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form={formId}
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
          disabled={!form.formState.isDirty}
        >
          {!form.formState.isSubmitting && <Edit size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
