'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@/components/ui'
import { validator } from '@/utils/validator'
import { useParams, useRouter } from 'next/navigation'
import { createPasswordAction } from './action'

type FormProps = z.input<typeof schema>
type OutputFormProps = z.output<typeof schema>

const schema = z
  .object({
    password: z
      .string()
      .min(2, {
        message: 'Senha é obrigatória',
      })
      .default('')
      .refine(validator.password, 'Senha inválida'),
    confirmPassword: z
      .string()
      .min(2, {
        message: 'Confirmação de senha é obrigatória',
      })
      .default(''),
    serverError: z.string().default('').optional(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) return false
      return data
    },
    {
      message: 'As senhas não coincidem.',
      path: ['confirmPassword'],
    }
  )
  .transform(({ password, confirmPassword }) => ({ password, confirmPassword }))

export default function CreatePassword() {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()

  const form = useForm<FormProps>({
    resolver: zodResolver(schema),
  })

  const fields = [
    {
      name: 'password',
      label: 'Senha',
      info: ['Mínimo 8 caracteres', 'Letras', 'Números', 'Caracteres especiais'],
    },
    { name: 'confirmPassword', label: 'Confirmação de senha' },
  ]

  async function onSubmit(data: FormProps) {
    const token = params?.id as string
    if (!token) return

    const res = await createPasswordAction({ ...(data as OutputFormProps), token })

    if (!res.ok) {
      toast({
        title: res.title,
        description: res.message,
        variant: 'destructive',
      })
      form.setError('serverError', {})
    } else {
      router.replace('/auth/login')
      toast({
        title: res.title,
        description: res.message,
        variant: 'success',
      })
    }
  }

  return (
    <section className='w-full text-center'>
      <h1 className='text-3xl md:text-2xl text-primary font-bold'>Conclua a sua conta</h1>
      <p className='text-xl md:text-lg mt-[6px] mb-10 text-foreground font-medium'>
        Crie a sua senha para concluir o cadastro na plataforma.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col max-w-xs md:max-w-sm mx-auto gap-6 text-left'
        >
          <div className='flex flex-col gap-4 md:gap-3'>
            {fields.map(({ label, name, info }, index) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof FormProps}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {info ? (
                        <Popover>
                          <PopoverTrigger className='flex items-center gap-1.5 pb-0.5'>
                            {label}
                            <Info size={16} />
                          </PopoverTrigger>
                          <PopoverContent>
                            <p className='font-semibold'>Deve conter:</p>
                            <ul className='list-disc px-4 py-1'>
                              {info.map((data, index) => (
                                <li key={data}>
                                  {data}
                                  {index !== info.length - 1 ? ';' : '.'}
                                </li>
                              ))}
                            </ul>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        label
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...(!index ? { autoFocus: true, tabIndex: 0 } : { autoComplete: 'current-password' })}
                        type='password'
                        placeholder='********'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button isLoading={form.formState.isSubmitting} type='submit'>
            Salvar senha
          </Button>
        </form>
      </Form>
    </section>
  )
}
