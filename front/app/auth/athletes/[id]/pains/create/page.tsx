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
import { PainTemplate } from '@/components/templates'

type IPainFormProps = z.input<typeof PainTemplate.schema>

export default function CreatePain() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { isAdmin } = useAuthContext()

  const actionText = 'Cadastrar'

  const athleteId = params.id as string
  const redirectRoute = isAdmin ? buildingRouteWithId(RouteEnum.PAINS, athleteId) : RouteEnum.AUTHENTICATED

  const form = useForm<IPainFormProps>({
    resolver: zodResolver(PainTemplate.schema),
    defaultValues: {
      pains: [{}],
    },
  })

  const pains = useFieldArray({
    control: form.control,
    name: 'pains',
  })

  async function onSubmit(data: IPainFormProps) {
    const res = await serverFetcher('pains', {
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
        <h1 className='text-xl md:text-lg font-semibold'>Cadastro de Dores.</h1>
        <p className='text-lg md:text-base'>
          Preencha os campos a seguir para {actionText.toLowerCase()} novas dores do atleta.
        </p>
      </header>
      <Form {...form}>
        <form id='injury-form' onSubmit={form.handleSubmit(onSubmit)} className='min-h-[140px]'>
          <ul className='mb-4 flex flex-col gap-4 divide-y-2'>
            {pains.fields.map((injury, index) => {
              return (
                <li key={injury.id} {...(index && { className: 'py-4' })}>
                  <div className='flex gap-4 justify-between'>
                    <p className='text-lg py-2 italic'>
                      Dor {!!pains.fields.length ? `- ${index + 1}` : ''}
                    </p>
                    <Button
                      title='Remover dor'
                      type='button'
                      className='h-8'
                      variant='ghost'
                      onClick={() => pains.remove(index)}
                    >
                      <Trash className='size-4' />
                    </Button>
                  </div>
                  <PainTemplate.Form index={index} key={injury.description} />
                </li>
              )
            })}
          </ul>
          <Button
            title='Adicionar dor'
            type='button'
            variant='secondary'
            onClick={() => {
              pains.append({} as IPainFormProps['pains'])
              form.setFocus(`pains.${pains.fields.length - 1}.date`)
            }}
          >
            {!!pains.fields.length ? <Plus className='size-4' /> : 'Adicionar'}
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
