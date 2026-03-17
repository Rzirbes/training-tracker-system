'use-client'

import { z } from 'zod'
import { useFormContext } from 'react-hook-form'
import { DatePicker, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider, Textarea } from '@/components/ui'
import { BodySide, bodySides, InjuryContext, injuryContexts } from '@/enums'

const schema = z.object({
  date: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === 'invalid_date' ? 'Data da dor muscular é obrigatório' : defaultError,
    }),
  }),
  bodyRegion: z
    .string({
      required_error: 'Região do corpo é obrigatório',
    })
    .min(1, 'Região do corpo é obrigatória')
    .max(255, 'Região do corpo deve ter no máximo 255 caracteres'),
  bodySide: z.nativeEnum(BodySide, {
    required_error: 'Lado do corpo é obrigatório',
  }),
  intensity: z.coerce.number().min(0).max(10).default(0),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').optional().default(''),
  occurredDuring: z.nativeEnum(InjuryContext, {
    required_error: 'Momento da ocorrência é obrigatório',
  }),
  uuid: z.string().optional().default('')
})

export const painSchema = z
  .object({
    pains: z.array(schema),
    serverError: z.string().default('').optional(),
  })
  .transform(({ pains }) => ({ pains }))

export type IPainFormProps = z.input<typeof painSchema>

interface Props {
  index: number
}

export function PainForm({ index }: Props) {
  const form = useFormContext<IPainFormProps>()

  return (
    <div className='space-y-4'>
      <DatePicker
        label='Data da dor'
        name={`pains.${index}.date`}
        control={form.control}
        disabled={(date) => date > new Date()}
      />
      <FormField
        control={form.control}
        name={`pains.${index}.bodyRegion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{'Local da Dor'}</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: posterior da coxa, lombar...' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`pains.${index}.bodySide`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lado</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(bodySides).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex flex-col gap-2'>
        <FormField
          control={form.control}
          name={`pains.${index}.intensity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{'Intensidade (0 a 10)'}</FormLabel>
              <FormControl>
                <Input {...field} placeholder='Insira a intensidade...' type='number' min={0} max={10} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`pains.${index}.intensity`}
          render={({ field: { value = 0, onChange } }) => (
            <FormItem>
              {/* <FormLabel>{'Intensidade (0 a 10)'}</FormLabel> */}
              <FormControl>
                <Slider min={0} max={10} value={[value]} onValueChange={onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`pains.${index}.occurredDuring`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ocorrida durante</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(injuryContexts).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`pains.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{'Descreva a dor'}</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder='Resumo geral da dor/lesão' maxLength={2000} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
