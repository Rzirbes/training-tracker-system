'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { startTransition } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Plus, Save, Trash } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteEnum } from '@/enums'
import { serverFetcher } from '@/services'
import { useAuthContext } from '@/contexts'
import { Button, Form, useToast } from '@/components/ui'
import { buildingRouteWithId } from '@/lib/utils'
import { InjuryTemplate } from '@/components/templates'

type IInjuryFormProps = z.input<typeof InjuryTemplate.schema>

export default function CreateInjury() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { isAdmin } = useAuthContext()

  const actionText = 'Cadastrar'

  const athleteId = params.id as string
  const redirectRoute = isAdmin ? buildingRouteWithId(RouteEnum.INJURIES, athleteId) : RouteEnum.AUTHENTICATED

  const form = useForm<IInjuryFormProps>({
    resolver: zodResolver(InjuryTemplate.schema),
    defaultValues: {
      injuries: [{}],
    },
  })

  const injuries = useFieldArray({
    control: form.control,
    name: 'injuries',
  })

  async function onSubmit(data: IInjuryFormProps) {
    const res = await serverFetcher('injuries', {
      method: 'POST',
      body: JSON.stringify({ ...data, athleteUuid: params.id }),
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
      router.replace(redirectRoute)
      toast({
        title: res.data?.message,
        variant: 'success',
      })
    }
  }

  return (
    <div className='flex flex-col justify-center h-full gap-5 w-full md:w-4/5 xl:w-2/5'>
      <header>
        <h1 className='text-xl md:text-lg font-semibold'>Cadastro de Lesões.</h1>
        <p className='text-lg md:text-base'>
          Preencha os campos a seguir para {actionText.toLowerCase()} novas lesões do atleta.
        </p>
      </header>
      <Form {...form}>
        <form id='injury-form' onSubmit={form.handleSubmit(onSubmit)} className='min-h-[140px]'>
          <ul className='mb-4 flex flex-col gap-4 divide-y-2'>
            {injuries.fields.map((injury, index) => {
              return (
                <li key={injury.id} {...(index && { className: 'py-4' })}>
                  <div className='flex gap-4 justify-between'>
                    <p className='text-lg py-2'>Lesão {!!injuries.fields.length ? `- ${index + 1}` : ''}</p>
                    <Button
                      title='Remover lesão'
                      type='button'
                      className='h-8'
                      variant='ghost'
                      onClick={() => injuries.remove(index)}
                    >
                      <Trash className='size-4' />
                    </Button>
                  </div>
                  <InjuryTemplate.Form index={index} key={injury.description} />
                </li>
              )
            })}
          </ul>
          <Button
            title='Adicionar lesão'
            type='button'
            variant='secondary'
            onClick={() => {
              injuries.append({} as IInjuryFormProps['injuries'])
              form.setFocus(`injuries.${injuries.fields.length - 1}.date`)
            }}
          >
            {!!injuries.fields.length ? <Plus className='size-4' /> : 'Adicionar'}
          </Button>
        </form>
      </Form>
      <footer className='flex flex-row justify-between py-4 gap-4'>
        <Link href={redirectRoute} scroll={true}>
          <Button variant='outline'>Cancelar</Button>
        </Link>
        <Button
          title={actionText}
          form='injury-form'
          className='w-fit'
          type='submit'
          isLoading={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting && <Save size={20} />}
          {actionText}
        </Button>
      </footer>
    </div>
  )
}
