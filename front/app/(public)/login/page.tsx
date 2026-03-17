'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  useToast,
} from '@/components/ui'
import { serverFetcher, services } from '@/services'
import { RouteEnum } from '@/enums'
import { createSession } from '@/server'

type FormProps = z.input<typeof schema>
type OutputFormProps = z.output<typeof schema>

const schema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, {
        message: 'E-mail é obrigatório',
      })
      .email('E-mail inválido')
      .default(''),
    password: z
      .string()
      .trim()
      .min(1, {
        message: 'Senha é obrigatório',
      })
      .default(''),
    keepLogin: z.boolean().default(false),
    serverError: z.string().default('').optional(),
  })
  .transform(({ email, password, keepLogin }) => ({ email, password, keepLogin }))

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  const fields = [
    { name: 'email', label: 'E-mail', placeholder: 'Digite o seu e-mail...' },
    {
      name: 'password',
      label: 'Senha',
      placeholder: 'Digite o sua senha...',
      type: 'password',
      autoComplete: 'current-password',
    },
  ]

  async function onSubmit({ email, password, keepLogin = false }: FormProps) {
    try {
      const res = await serverFetcher('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        cache: 'no-cache',
        auth: false,
      })

      if (res.ok) {
        await createSession({
          access: res.data.token,
          refresh: res.data.refreshToken,
          user: { ...res.data.user, keepAuth: keepLogin },
        })
        router.push(RouteEnum.AUTHENTICATED)
      } else {
        form.setError('serverError', {})
        const title = res?.data?.title ?? 'Credenciais inválidas'
        const description = res?.data?.message ?? 'Verifique os dados e tente novamente...'
        toast({
          title,
          description,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Desculpe, ocorreu um erro.',
        description: 'Tente novamente em instantes...',
        variant: 'destructive',
      })
    }
  }

  return (
    <section className='w-full text-center pt-8 lg:pt-4'>
      <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Acesse sua conta</h1>
      <p className='text-xl md:text-lg mt-[6px] mb-8 md:mb-6 text-zinc-600 font-medium text-balance'>
        Insira seu e-mail para acessar o painel do usuário.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <div className='flex flex-col gap-4 md:gap-3'>
            {fields.map(({ label, name, placeholder, type, autoComplete }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof Omit<FormProps, 'keepLogin'>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...(!index && { autoFocus: true, tabIndex: 0 })}
                        {...{ type, autoComplete }}
                        placeholder={placeholder}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <fieldset className='flex items-center space-x-2 mt-1'>
              <Checkbox
                id='keepLogin'
                checked={form.watch('keepLogin')}
                onCheckedChange={(checked) => form.setValue('keepLogin', checked as boolean)}
              />
              <Label className='text-zinc-700' htmlFor='keepLogin'>
                Manter-se conectado
              </Label>
            </fieldset>
          </div>
          <Button isLoading={form.formState.isSubmitting} type='submit'>
            Entrar
          </Button>
          <Link href={RouteEnum.FORGOT_PASSWORD}>
            <Button variant='link' className='w-full text-center text-primary-medium' type='button'>
              Esqueceu sua senha?
            </Button>
          </Link>
        </form>
      </Form>
    </section>
  )
}
