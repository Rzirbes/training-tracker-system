'use client'

import Link from 'next/link'
import { startTransition } from 'react'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { serverFetcher } from '@/services'
import {
  Form,
  useToast,
  Button,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui'
import revalidateTag from '@/lib/revalidate-action'
import { RouteEnum } from '@/enums'
import { createFormData } from '@/utils'
import { AthleteTemplate, type IAthleteFormProps } from '@/components/templates'

export default function AthleteForm() {
  const router = useRouter()
  const { toast } = useToast()
  const actionTitle = 'Cadastrar'

  const form = useForm<IAthleteFormProps>({
    resolver: zodResolver(AthleteTemplate.schema),
  })

  const { isSubmitting } = form.formState

  async function onSubmit(data: IAthleteFormProps) {
    const formData = createFormData(data)

    const res = await serverFetcher<{ id: string; title?: string; message: string; field?: 'email' | 'cpf' }>(
      'athletes',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (res.ok) {
      revalidateTag('athletes')
      toast({
        title: res.data?.title,
        description: res.data.message,
        variant: 'success',
      })
      router.push(RouteEnum.ATHLETES, { scroll: true })
    } else {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description:
            (Array.isArray(res.data?.message) ? res.data?.message.join(', ').concat('.') : res.data?.message) ||
            'Tente novamente em instantes...',
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
    <div className='flex flex-col justify-center w-full gap-1 relative h-full py-4 px-2'>
      <header className='flex flex-col gap-0.5 px-6 md:px-8'>
        <h1 className='text-xl font-semibold'>{actionTitle} atleta</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.ATHLETES}>Atletas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className='mt-4'>Preencha os campos a seguir para {actionTitle.toLowerCase()} o seu atleta na plataforma.</p>
      </header>
      <div className='px-6 md:px-8'>
        <Form {...form}>
          <AthleteTemplate.Form onSubmit={onSubmit} />
        </Form>
        <footer className='flex flex-row justify-between mb-4 py-4 w-full sm:w-2/3 md:w-3/6'>
          <Link href={RouteEnum.ATHLETES} className='w-fit' tabIndex={-1}>
            <Button variant='outline'>Cancelar</Button>
          </Link>
          <Button form='athlete' className='w-fit' type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
            {!isSubmitting && <Save size={20} />}
            {actionTitle}
          </Button>
        </footer>
      </div>
    </div>
  )
}
