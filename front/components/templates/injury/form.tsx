'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import {
  Checkbox,
  DatePicker,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { bodySides, degreeLabels, injuryContexts } from '@/enums'
import { injuriesSchema } from './schema'

export type InjuryFormValues = z.input<typeof injuriesSchema>

interface Props {
  index: number
}

export function InjuryForm({ index }: Props) {
  const form = useFormContext<InjuryFormValues>()

  const today = new Date()
  const injuryDate = form.watch(`injuries.${index}.date`)

  return (
    <div className='space-y-4'>
      <DatePicker
        label='Data da lesão'
        name={`injuries.${index}.date`}
        control={form.control}
        disabled={(date) => date > today}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de lesão</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: Ruptura LCA, distensão...' maxLength={255} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.bodyRegion`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Região do corpo</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Ex: joelho, tornozelo...' maxLength={255} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.bodySide`}
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

      <FormField
        control={form.control}
        name={`injuries.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grau</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecione' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(degreeLabels).map(([value, label]) => (
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

      <FormField
        control={form.control}
        name={`injuries.${index}.occurredDuring`}
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
        name={`injuries.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder='Descreva os sintomas, como ocorreu...' maxLength={2000} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.examType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de exame</FormLabel>
            <FormControl>
              <Input {...field} placeholder='RM, Raio-X, Ultrassom...' maxLength={255} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.diagnosisConfirmed`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className='ml-2'>Diagnóstico confirmado?</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.requiresSurgery`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className='ml-2'>Necessário cirurgia?</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch(`injuries.${index}.requiresSurgery`) && (
        <DatePicker label='Data da cirurgia' name={`injuries.${index}.surgeryDate`} control={form.control} />
      )}

      <FormField
        control={form.control}
        name={`injuries.${index}.treatmentType`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de tratamento</FormLabel>
            <FormControl>
              <Input {...field} placeholder='Fisioterapia, repouso...' maxLength={255} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DatePicker label='Retorno planejado' name={`injuries.${index}.returnDatePlanned`} control={form.control} />

      <DatePicker
        label='Retorno real'
        name={`injuries.${index}.returnDateActual`}
        control={form.control}
        disabled={(date) => date > today || date < injuryDate }
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.minutesFirstGame`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minutos no 1º jogo</FormLabel>
            <FormControl>
              <Input type='number' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`injuries.${index}.notes`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observações gerais</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder='Algo a mais sobre o caso...' maxLength={2000} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
