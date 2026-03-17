'use client'

import { startTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Angry, Frown, Annoyed, Smile, Laugh, CircleCheck, Send } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Logo, toast } from '@/components/ui'
import { getHelloTextByTime } from '@/lib/dates'
import { serverFetcher } from '@/services'
import type { IPageProps } from '@/types'

const questionsSchema = z.coerce
  .number()
  .or(z.null().default(null))
  .refine((value) => value !== null, { message: 'Pergunta obrigatória' })

const schema = z
  .object({
    sleep: questionsSchema,
    sleepHours: questionsSchema,
    energy: questionsSchema,
    stress: questionsSchema,
    nutrition: questionsSchema,
    waterIntake: questionsSchema,
    pain: questionsSchema,
    fatigue: questionsSchema,
    humor: questionsSchema,
    motivation: questionsSchema,
    accordion: z.string(),
  })
  .transform(({ accordion, ...data }) => data)

type FormProps = z.input<typeof schema>

const icons = {
  angry: <Angry size={18} />,
  frown: <Frown size={18} />,
  annoyed: <Annoyed size={18} />,
  smile: <Smile size={18} />,
  laugh: <Laugh size={18} />,
}

const options = [
  { icon: icons.angry, value: 1, label: 'Péssima' },
  { icon: icons.frown, value: 2, label: 'Ruim' },
  { icon: icons.annoyed, value: 3, label: 'Normal' },
  { icon: icons.smile, value: 4, label: 'Boa' },
  { icon: icons.laugh, value: 5, label: 'Excelente' },
]

const questions = [
  { value: 'sleep', label: 'Como foi sua noite de sono?' },
  {
    value: 'sleepHours',
    label: 'Quantas horas de sono?',
    options: [
      { label: 'Menos de 5h', value: 1, icon: icons.frown },
      { label: '5-6h', value: 2, icon: icons.annoyed },
      { label: '7-8h', value: 3, icon: icons.smile },
      { label: 'Mais de 8h', value: 4, icon: icons.laugh },
    ],
  },
  { value: 'energy', label: 'Como está a sua energia?' },
  { value: 'stress', label: 'Como está o seu nível de stress?' },
  { value: 'nutrition', label: 'Como está a sua alimentação?' },
  {
    value: 'waterIntake',
    label: 'Como está seu consumo de água?',
    options: [
      { label: 'Menos de 1L', value: 1, icon: icons.frown },
      { label: '1-2L', value: 2, icon: icons.annoyed },
      { label: '2-3L', value: 3, icon: icons.smile },
      { label: 'Mais de 3L', value: 4, icon: icons.laugh },
    ],
  },
  {
    value: 'pain',
    label: 'Como está a dor no corpo?',
    options: [
      { label: 'Muito Forte', value: 1, icon: icons.angry },
      { label: 'Forte', value: 2, icon: icons.frown },
      { label: 'Moderada', value: 3, icon: icons.annoyed },
      { label: 'Leve', value: 4, icon: icons.smile },
      { label: 'Sem dor', value: 5, icon: icons.laugh },
    ],
  },
  {
    value: 'fatigue',
    label: 'Como está sua fadiga?',
    options: [
      { label: 'Muito Intensa', value: 1, icon: icons.angry },
      { label: 'Intensa', value: 2, icon: icons.frown },
      { label: 'Moderado', value: 3, icon: icons.annoyed },
      { label: 'Leve', value: 4, icon: icons.smile },
      { label: 'Sem fadiga', value: 5, icon: icons.laugh },
    ],
  },
  {
    value: 'humor',
    label: 'Como está seu humor?',
    options: [
      { label: 'Péssimo', value: 1, icon: icons.angry },
      { label: 'Ruim', value: 2, icon: icons.frown },
      { label: 'Regular', value: 3, icon: icons.annoyed },
      { label: 'Bom', value: 4, icon: icons.smile },
      { label: 'Excelente', value: 5, icon: icons.laugh },
    ],
  },
  { value: 'motivation', label: 'Como está sua motivação?' },
]

export default function AthleteDayMonitoryPage({ params, searchParams }: IPageProps) {
  const { token } = params
  const { name = 'atleta' } = searchParams

  const {
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<FormProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      accordion: questions[0].value,
      energy: null,
      humor: null,
      pain: null,
      sleep: null,
      stress: null,
    },
  })

  const accordion = watch('accordion')
  const greetingByTime = getHelloTextByTime()
  const completedAnswers = Object.values(getValues()).every((value) => value !== null)

  function setAnswer(key: string, value: number) {
    const currentAnswerIndex = questions.findIndex(({ value }) => value === key)
    const nextAnswerIndex = currentAnswerIndex < questions.length - 1 ? currentAnswerIndex + 1 : null
    startTransition(() => {
      setValue(key as keyof FormProps, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
      !!nextAnswerIndex && setValue('accordion', questions[nextAnswerIndex].value)
    })
  }

  async function submit(data: FormProps) {
    const response = await serverFetcher('monitoring/well-being', {
      method: 'POST',
      body: JSON.stringify({ ...data, token }),
      auth: false,
    })
    toast({
      title: response?.data?.title,
      description: response?.data?.message,
      variant: response.ok ? 'success' : 'destructive',
    })
    if (!response.ok) throw response
  }

  if (isSubmitSuccessful) {
    return (
      <section className='w-full h-fit flex justify-center items-center p-3'>
        <div
          onSubmit={handleSubmit(submit)}
          className='w-fit h-fit border border-border rounded-md p-8 flex flex-col items-center gap-4 md:gap-3 text-center text-balance'
        >
          <span className='hidden xl:inline'>
            <Logo />
          </span>
          <span className='text-primary text-xl md:text-2xl font-semibold'>Bem-estar enviado com sucesso, {name}!</span>
          <h1 className='text-foreground text-lg md:text-xl font-medium'>
            Obrigado nos informar como você está se sentindo hoje,
            <br /> as informações serão importantes para o planejamento dos próximos treinos.
          </h1>
          <CircleCheck size={80} className='text-primary-medium' />
        </div>
      </section>
    )
  }

  return (
    <section className='w-full flex justify-center p-3'>
      <form
        onSubmit={handleSubmit(submit)}
        className='w-full lg:mx-16 mt-1 border border-border rounded-md p-8 flex flex-col items-center gap-4 md:gap-4'
      >
        <span className='hidden xl:inline'>
          <Logo />
        </span>
        <p className='text-foreground text-xl md:text-2xl font-semibold'>
          {greetingByTime} <span className='text-primary'>{name}!</span>
        </p>
        <h1 className='text-foreground text-lg md:text-xl font-medium text-center text-balance'>
          Como você se sente hoje?
          <br />
          Saber como você está é importante para o planejamento dos treinos.
        </h1>
        <Accordion
          type='single'
          value={accordion}
          onValueChange={(key) => setValue('accordion', key)}
          className='w-full'
        >
          {questions.map((question) => (
            <AccordionItem value={question.value} key={question.value}>
              <AccordionTrigger>{question.label}</AccordionTrigger>
              <AccordionContent className='flex flex-col gap-2'>
                <ul className='w-full flex flex-col md:flex-row gap-2 justify-between'>
                  {(question?.options ?? options).map(({ icon, label, value }) => (
                    <li className='w-full' key={value}>
                      <button
                        type='button'
                        data-active={watch(question.value as keyof FormProps) === value}
                        className='w-full flex md:justify-center gap-1 items-center border border-primary rounded-md py-3 md:py-1.5 px-4 md:px-2.5 font-medium text-primary text-lg md:text-sm data-[active=true]:bg-primary data-[active=true]:text-black data-[active=true]:border-primary hover:bg-primary data-[active=true]:hover:bg-primary hover:text-black'
                        onClick={() => setAnswer(question.value, value)}
                      >
                        {icon}
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button isLoading={isSubmitting} type='submit' className='mt-4' disabled={!completedAnswers}>
          {!isSubmitting && <Send />}
          Enviar Respostas
        </Button>
      </form>
    </section>
  )
}
