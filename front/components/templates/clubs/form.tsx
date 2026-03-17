'use client'

import { startTransition } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import {
  Button,
  DatePicker,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@/components/ui'
import { useCities, useClubs, useCountries, useStates } from '@/hooks'
import { useDialogContext } from '@/contexts'
import { AddressTemplate } from '../address'
import { ClubForm } from './club-form'

const schema = z.object({
  countryId: z.string().min(1, 'País é obrigatório').default(''),
  stateId: z.string().min(1, 'Estado é obrigatório').default(''),
  cityId: z.string().min(1, 'Cidade é obrigatório').default(''),
  clubId: z.string().min(1, 'Clube é obrigatório').default(''),
  startDate: z.coerce.date({
    errorMap: (issue, { defaultError }) => ({
      message: issue.code === 'invalid_date' ? 'Data de início é obrigatória' : defaultError,
    }),
  }),
  current: z.boolean().default(false),
  endDate: z.coerce
    .date({
      errorMap: (issue, { defaultError }) => ({
        message: issue.code === 'invalid_date' ? 'Data de término inválida' : defaultError,
      }),
    })
    .optional(),
  uuid: z.string().optional().default(''),
})

export const clubsSchema = z
  .object({
    clubs: z.array(schema),
    serverError: z.string().default('').optional(),
  })
  .transform(({ clubs }) => ({ clubs }))

export type IClubFormProps = z.input<typeof clubsSchema>

interface Props {
  index: number
}

export function ClubsForm({ index }: Props) {
  const { dialog } = useDialogContext()

  const form = useFormContext<IClubFormProps>()
  
  const current = form.watch(`clubs.${index}.current`)
  const countryId = form.watch(`clubs.${index}.countryId`)
  const stateId = form.watch(`clubs.${index}.stateId`)
  const cityId = form.watch(`clubs.${index}.cityId`)

  const { data: countries = [], mutate: mutateCountries } = useCountries()
  const { data: states = [], mutate: mutateStates } = useStates(countryId)
  const { data: cities = [], mutate: mutateCities } = useCities(stateId)
  const { data: clubsOptions = [], mutate: mutateClubs } = useClubs(cityId)

  function onChangeCountry() {
    form.resetField(`clubs.${index}.stateId`, {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateStates()
    onChangeState()
  }

  function onChangeState() {
    form.resetField(`clubs.${index}.cityId`, {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateCities()
    onChangeCity()
  }

  function onChangeCity() {
    form.resetField(`clubs.${index}.clubId`, {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateClubs()
  }

  return (
    <div autoFocus className='space-y-4'>
      <div autoFocus className='flex gap-4 items-end'>
        <FormField
          control={form.control}
          name={`clubs.${index}.countryId`}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>País</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  autoComplete='on'
                  value={field.value as unknown as string}
                  onValueChange={(country) => {
                    field.onChange(country)
                    field.onBlur()
                    onChangeCountry()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue autoFocus placeholder='Selecione o país' />
                  </SelectTrigger>
                  <SelectContent autoFocus>
                    {countries.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!countries.length && <span className='px-2 text-lg md:text-sm '>Nenhum país encontrado...</span>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant='secondary'
          type='button'
          className='w-fit'
          onClick={() => {
            dialog.current?.open(
              <AddressTemplate.CountryForm
                onCancel={dialog.current.close}
                onSuccess={(id) => {
                  dialog.current?.close()
                  mutateCountries()
                  startTransition(() => {
                    form.setValue(`clubs.${index}.countryId`, id)
                    onChangeCountry()
                  })
                }}
              />
            )
          }}
        >
          <Plus className='size-4' />
        </Button>
      </div>
      <div className='flex gap-4 items-end'>
        <FormField
          control={form.control}
          name={`clubs.${index}.stateId`}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  disabled={!countryId}
                  autoComplete='on'
                  value={field.value as unknown as string}
                  onValueChange={(state) => {
                    field.onChange(state)
                    field.onBlur()
                    onChangeState()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o estado' />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!states.length && <span className='px-2 text-lg md:text-sm '>Nenhum estado encontrado...</span>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant='secondary'
          type='button'
          className='w-fit'
          onClick={() => {
            dialog.current?.open(
              <AddressTemplate.StateForm
                defaultValues={{
                  countryId,
                }}
                onCancel={dialog.current.close}
                onSuccess={({ country, state }) => {
                  dialog.current?.close()
                  mutateStates()
                  startTransition(() => {
                    form.setValue(`clubs.${index}.countryId`, country)
                    form.setValue(`clubs.${index}.stateId`, state)
                  })
                }}
              />
            )
          }}
        >
          <Plus className='size-4' />
        </Button>
      </div>

      <div className='flex gap-4 items-end'>
        <FormField
          control={form.control}
          name={`clubs.${index}.cityId`}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  disabled={!stateId}
                  autoComplete='on'
                  value={field.value as unknown as string}
                  onValueChange={(city) => {
                    field.onChange(city)
                    field.onBlur()
                    onChangeCity()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a cidade' />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!cities.length && <span className='px-2 text-lg md:text-sm '>Nenhuma cidade encontrada...</span>}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant='secondary'
          type='button'
          className='w-fit'
          onClick={() => {
            dialog.current?.open(
              <AddressTemplate.CityForm
                defaultValues={{
                  countryId,
                  stateId,
                }}
                onCancel={dialog.current.close}
                onSuccess={({ country, state, city }) => {
                  dialog.current?.close()
                  mutateCities()
                  startTransition(() => {
                    form.setValue(`clubs.${index}.countryId`, country)
                    form.setValue(`clubs.${index}.stateId`, state)
                    form.setValue(`clubs.${index}.cityId`, city)
                  })
                }}
              />
            )
          }}
        >
          <Plus className='size-4' />
        </Button>
      </div>

      <div className='flex gap-4 items-end'>
        <FormField
          control={form.control}
          name={`clubs.${index}.clubId`}
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Clube</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  autoComplete='on'
                  value={field.value as unknown as string}
                  disabled={!cityId}
                  onValueChange={(country) => {
                    field.onChange(country)
                    field.onBlur()
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o clube' />
                  </SelectTrigger>
                  <SelectContent>
                    {clubsOptions.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                    {!clubsOptions.length && (
                      <span className='px-2 text-lg md:text-sm '>Nenhum clube encontrado...</span>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant='secondary'
          type='button'
          className='w-fit'
          onClick={() => {
            dialog.current?.open(
              <ClubForm
                defaultValues={{
                  countryId,
                  stateId,
                  cityId,
                }}
                onCancel={dialog.current.close}
                onSuccess={({ club, country, state, city }) => {
                  dialog.current?.close()
                  mutateClubs()
                  startTransition(() => {
                    form.setValue(`clubs.${index}.clubId`, club)
                    form.setValue(`clubs.${index}.countryId`, country)
                    form.setValue(`clubs.${index}.stateId`, state)
                    form.setValue(`clubs.${index}.cityId`, city)
                  })
                }}
              />
            )
          }}
        >
          <Plus className='size-4' />
        </Button>
      </div>

      <DatePicker
        autoFocus={false}
        label='Data de chegada'
        name={`clubs.${index}.startDate`}
        control={form.control}
        disabled={(date) => date > new Date()}
      />

      <FormField
        control={form.control}
        name={`clubs.${index}.current`}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-1'>
            <FormLabel className='mb-0'>Atualmente no clube?</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!current && (
        <DatePicker
          autoFocus={false}
          label='Data de saída'
          name={`clubs.${index}.endDate`}
          control={form.control}
          disabled={(date) => date > new Date()}
        />
      )}
    </div>
  )
}
