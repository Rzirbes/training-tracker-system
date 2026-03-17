'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Send } from 'lucide-react'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import Link from 'next/link'
import { RouteEnum } from '@/enums'

type FormProps = z.input<typeof schema>

const schema = z
  .object({
    email: z
      .string()
      .email({ message: 'E-mail inválido' })
      .min(1, {
        message: 'E-mail é obrigatório',
      })
      .default(''),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email }) => ({ email }))

export default function CreatePassword() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormProps) {
    const token = location.pathname.split('/').at(-1)
    if (!token) return

    const res = await serverFetcher('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
      auth: false,
    })

    if (!res.ok) {
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'destructive',
      })
      form.setError('serverError', {})
    } else {
      router.replace('/auth/login')
      toast({
        title: res.data.title,
        description: res.data.message,
        variant: 'success',
      })
    }
  }
  const { isSubmitting } = form.formState

  return (
    <section className='w-full text-center pt-8 xl:pt-4 xl:my-auto'>
      <h1 className='text-3xl xl:text-2xl text-primary-medium font-bold'>Recuperar Senha</h1>
      <div className='w-full flex justify-center'>
        <p className='text-xl xl:text-xl mt-[6px] mb-6 text-zinc-600 font-medium w-full md:w-2/4 text-balance'>
          Caso tenha esquecido da senha, informe o seu e-mail abaixo para solicitar a recuperação.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus tabIndex={0} placeholder='Digite seu e-mail...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} isLoading={isSubmitting} type='submit'>
            {!isSubmitting && <Send size={20} />}
            Enviar
          </Button>
          <Link href={RouteEnum.LOGIN}>
            <Button variant='ghost' type='button' className='w-fit text-primary-medium'>
              <ArrowLeft size={20} />
              Voltar
            </Button>
          </Link>
        </form>
      </Form>
    </section>
  )
}
