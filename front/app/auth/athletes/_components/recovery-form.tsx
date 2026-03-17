'use client'

import { ReactNode, startTransition, useState } from 'react'
import { useForm, type FieldPath } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Angry, Annoyed, Edit, Frown, Laugh, Save, Smile } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  toast,
} from '@/components/ui'
import { serverFetcher } from '@/services'

export type IRecoveryFormProps = z.input<typeof recoverySchema>
export type IOutputRecoveryFormProps = z.output<typeof recoverySchema>

type IFormField = FieldPath<Omit<IRecoveryFormProps, 'serverError'>>

interface Props {
  date: Date
  athleteId: string
  children: ReactNode
  onSuccess(): void
  defaultValues?: IRecoveryFormProps
  id?: string
}

const recoverySchema = z
  .object({
    sleep: z.string().min(1, { message: 'Qualidade do sono é obrigatório' }).default('').transform(Number),
    sleepHours: z.string().min(1, { message: 'Horas de sono é obrigatório' }).default('').transform(Number),
    energy: z.string().min(1, { message: 'Nível de energia é obrigatório' }).default('').transform(Number),
    stress: z.string().min(1, { message: 'Nível de estresse é obrigatório' }).default('').transform(Number),
    nutrition: z.string().min(1, { message: 'Nutrição é obrigatório' }).default('').transform(Number),
    waterIntake: z.string().min(1, { message: 'Ingestão de água é obrigatório' }).default('').transform(Number),
    pain: z.string().min(1, { message: 'Nível de dor é obrigatório' }).default('').transform(Number),
    fatigue: z.string().min(1, { message: 'Nível de fadiga é obrigatório' }).default('').transform(Number),
    humor: z.string().min(1, { message: 'Humor é obrigatório' }).default('').transform(Number),
    motivation: z.string().min(1, { message: 'Motivação é obrigatório' }).default('').transform(Number),
    serverError: z.string().default('').optional(),
  })
  .transform(({ serverError: _, ...data }) => data)

const icons = {
  angry: <Angry size={18} />,
  frown: <Frown size={18} />,
  annoyed: <Annoyed size={18} />,
  smile: <Smile size={18} />,
  laugh: <Laugh size={18} />,
}

const options: Record<IFormField, { label: string; value: number; icon: ReactNode }[]> = {
  sleep: [
    { label: 'Péssima', value: 1, icon: icons.angry },
    { label: 'Ruim', value: 2, icon: icons.frown },
    { label: 'Normal', value: 3, icon: icons.annoyed },
    { label: 'Boa', value: 4, icon: icons.smile },
    { label: 'Excelente', value: 5, icon: icons.laugh },
  ],
  sleepHours: [
    { label: 'Menos de 5h', value: 1, icon: icons.frown },
    { label: '5-6h', value: 2, icon: icons.annoyed },
    { label: '7-8h', value: 3, icon: icons.smile },
    { label: 'Mais de 8h', value: 4, icon: icons.laugh },
  ],
  energy: [
    { label: 'Muito baixo', value: 1, icon: icons.angry },
    { label: 'Baixo', value: 2, icon: icons.frown },
    { label: 'Moderado', value: 3, icon: icons.annoyed },
    { label: 'Alto', value: 4, icon: icons.smile },
    { label: 'Muito alto', value: 5, icon: icons.laugh },
  ],
  stress: [
    { label: 'Muito alto', value: 1, icon: icons.angry },
    { label: 'Alto', value: 2, icon: icons.frown },
    { label: 'Moderado', value: 3, icon: icons.annoyed },
    { label: 'Baixo', value: 4, icon: icons.smile },
    { label: 'Muito baixo', value: 5, icon: icons.laugh },
  ],
  nutrition: [
    { label: 'Muito ruim', value: 1, icon: icons.angry },
    { label: 'Ruim', value: 2, icon: icons.frown },
    { label: 'Regular', value: 3, icon: icons.annoyed },
    { label: 'Boa', value: 4, icon: icons.smile },
    { label: 'Muito boa', value: 5, icon: icons.laugh },
  ],
  waterIntake: [
    { label: 'Menos de 1L', value: 1, icon: icons.frown },
    { label: '1-2L', value: 2, icon: icons.annoyed },
    { label: '2-3L', value: 3, icon: icons.smile },
    { label: 'Mais de 3L', value: 4, icon: icons.laugh },
  ],
  pain: [
    { label: 'Muito Forte', value: 1, icon: icons.angry },
    { label: 'Forte', value: 2, icon: icons.frown },
    { label: 'Moderada', value: 3, icon: icons.annoyed },
    { label: 'Leve', value: 4, icon: icons.smile },
    { label: 'Sem dor', value: 5, icon: icons.laugh },
  ],
  fatigue: [
    { label: 'Muito Intensa', value: 1, icon: icons.angry },
    { label: 'Intensa', value: 2, icon: icons.frown },
    { label: 'Moderado', value: 3, icon: icons.annoyed },
    { label: 'Leve', value: 4, icon: icons.smile },
    { label: 'Sem fadiga', value: 5, icon: icons.laugh },
  ],
  humor: [
    { label: 'Péssimo', value: 1, icon: icons.angry },
    { label: 'Ruim', value: 2, icon: icons.frown },
    { label: 'Regular', value: 3, icon: icons.annoyed },
    { label: 'Bom', value: 4, icon: icons.smile },
    { label: 'Excelente', value: 5, icon: icons.laugh },
  ],
  motivation: [
    { label: 'Muito baixo', value: 1, icon: icons.angry },
    { label: 'Baixo', value: 2, icon: icons.frown },
    { label: 'Moderado', value: 3, icon: icons.annoyed },
    { label: 'Alto', value: 4, icon: icons.smile },
    { label: 'Muito alto', value: 5, icon: icons.laugh },
  ],
}

const labels: Record<IFormField, string> = {
  sleep: 'Qualidade do sono',
  sleepHours: 'Horas de sono',
  energy: 'Energia',
  stress: 'Nível de stress',
  nutrition: 'Alimentação',
  waterIntake: 'Ingestão de água',
  pain: 'Dor',
  fatigue: 'Fadiga',
  humor: 'Humor',
  motivation: 'Motivação',
}

const initialValue: IRecoveryFormProps = {
  energy: '',
  fatigue: '',
  humor: '',
  motivation: '',
  nutrition: '',
  pain: '',
  sleep: '',
  sleepHours: '',
  stress: '',
  waterIntake: '',
}

export function RecoveryFormModal({ id, athleteId, children, defaultValues = initialValue, onSuccess, date }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<IRecoveryFormProps>({
    resolver: zodResolver(recoverySchema),
    defaultValues,
  })

  async function onSubmit(formData: IRecoveryFormProps) {
    const endpoint = `monitoring/well-being/${id ?? 'day'}`
    const method = !!id ? 'PUT' : 'POST'
    const payload: IOutputRecoveryFormProps = formData as unknown as IOutputRecoveryFormProps

    const res = await serverFetcher(endpoint, {
      method,
      body: JSON.stringify({ ...payload, date, athleteId }),
    })
    if (!res.ok) {
      startTransition(() => {
        toast({
          title: res.data?.title || 'Ops parece que ocorreu um erro!',
          description: res.data?.message || 'Tente novamente em instantes...',
          variant: 'destructive',
        })
      })
      form.setError('serverError', {})
    } else {
      form.reset({})
      toast({
        title: res.data?.title,
        description: res.data?.message,
        variant: 'success',
      })
      onSuccess()
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button>{children}</button>
      </DialogTrigger>
      <DialogContent className='max-w-xl h-full lg:h-fit overflow-y-auto'>
        <DialogHeader className='text-left'>
          <DialogTitle>Avaliação de Bem-estar</DialogTitle>
          <DialogDescription>Preencha os dados relacionados ao bem-estar do atleta.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-3 gap-x-8 pt-2 pb-6'>
              {Object.entries(options).map(([key, values]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as IFormField}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{labels[key as IFormField]}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione uma opção' />
                          </SelectTrigger>
                          <SelectContent>
                            {values.map((option) => (
                              <SelectItem key={option.label} value={String(option.value)}>
                                <div className='flex gap-2 items-center'>
                                  {option.icon}
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <div className='flex gap-4 items-center justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='outline' className='w-fit'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type='submit' className='w-fit flex gap-2'>
                {!!defaultValues ? <Edit className='size-5' /> : <Save className='size-5' />}
                {!!defaultValues ? 'Editar' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
