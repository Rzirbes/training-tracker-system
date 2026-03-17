'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Form,
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
  toast,
} from '@/components/ui'
import revalidateAction from '@/lib/revalidate-action'
import { teamMemberSchema, type ITeamMemberFormProps } from '../_schema'
import { RouteEnum } from '@/enums'
import { useCities, useCountries, useStates } from '@/hooks'
import { AddressTemplate } from '@/components/templates/address'
import { useDialogContext } from '@/contexts'
import { Plus } from 'lucide-react'
import { startTransition } from 'react'
import { DialingCode, mask } from '@/utils/mask'

interface Props {
  onSubmit: (data: ITeamMemberFormProps) => Promise<{
    ok: boolean
    data: any
    status: number
  }>
  defaultValues?: ITeamMemberFormProps
}

enum Sessions {
  DATA = 'data',
  ADDRESS = 'address',
  SETTINGS = 'settings',
}

export function TeamMemberForm({ onSubmit, defaultValues }: Props) {
  const router = useRouter()

  const { dialog } = useDialogContext()

  const form = useForm<ITeamMemberFormProps>({
    defaultValues,
    resolver: zodResolver(teamMemberSchema),
    reValidateMode: 'onChange',
  })

  const countryId = form.watch('address.countryId')
  const stateId = form.watch('address.stateId')

  const { data: countries = [], mutate: mutateCountries } = useCountries()
  const { data: states = [], mutate: mutateStates } = useStates(countryId)
  const { data: cities = [], mutate: mutateCities } = useCities(stateId)

  function onChangeCountry() {
    form.resetField('address.stateId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    form.resetField('address.cityId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateStates()
    mutateCities()
  }

  function onChangeState() {
    form.resetField('address.cityId', {
      defaultValue: '',
      keepDirty: true,
      keepError: true,
      keepTouched: true,
    })
    mutateCities()
  }

  return (
    <Form {...form}>
      <form
        id='collaborator'
        onSubmit={form.handleSubmit(async (data) => {
          const res = await onSubmit(data)
          if (res.ok) {
            revalidateAction('coaches')
            toast({
              title: res.data.title,
              description: res.data.message,
              variant: 'success',
            })
            router.push(RouteEnum.TEAM_MEMBERS)
          } else {
            toast({
              title: res.data?.title || 'Ops parece que ocorreu um erro!',
              description: res.data?.message || 'Tente novamente em instantes...',
              variant: 'destructive',
            })
          }
        })}
        className='flex flex-col gap-6 text-left py-4 min-h-full sm:w-2/3 md:w-2/5 h-full'
      >
        <Accordion
          defaultValue={[Sessions.DATA, Sessions.ADDRESS, Sessions.SETTINGS]}
          type='multiple'
          className='w-full flex flex-col gap-y-6'
        >
          <AccordionItem value={Sessions.DATA}>
            <AccordionTrigger>Informações Básicas</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Colaborador</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o nome completo...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o e-mail...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o cargo do colaborador...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Digite o Celular...'
                        mask={mask.dialingCode[DialingCode.BRAZIL].replace('+99 ', '')}
                        maxLength={22}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={Sessions.ADDRESS}>
            <AccordionTrigger>Endereço</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-6'>
              <FormField
                control={form.control}
                name='address.zipCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='00000-000' mask={mask.cep} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address.street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o rua...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address.buildingNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o número...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address.neighborhood'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o bairro...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address.complement'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Digite o complemento...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4 items-end'>
                <FormField
                  control={form.control}
                  name='address.countryId'
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
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o país' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                            {!countries.length && (
                              <span className='px-2 text-lg md:text-sm '>Nenhum país encontrado...</span>
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
                      <AddressTemplate.CountryForm
                        onCancel={dialog.current.close}
                        onSuccess={(id) => {
                          dialog.current?.close()
                          mutateCountries()
                          startTransition(() => {
                            form.setValue('address.countryId', id)
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
                  name='address.stateId'
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
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione o estado' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                            {!states.length && (
                              <span className='px-2 text-lg md:text-sm '>Nenhum estado encontrado...</span>
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
                      <AddressTemplate.StateForm
                        defaultValues={{
                          countryId,
                        }}
                        onCancel={dialog.current.close}
                        onSuccess={({ country, state }) => {
                          dialog.current?.close()
                          mutateStates()
                          startTransition(() => {
                            form.setValue('address.countryId', country)
                            form.setValue('address.stateId', state)
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
                  name='address.cityId'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          disabled={!stateId}
                          autoComplete='on'
                          onValueChange={field.onChange}
                          value={field.value as unknown as string}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione a cidade' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map(({ label, value }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                            {!cities.length && (
                              <span className='px-2 text-lg md:text-sm '>Nenhuma cidade encontrada...</span>
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
                            form.setValue('address.countryId', country)
                            form.setValue('address.stateId', state)
                            form.setValue('address.cityId', city)
                          })
                        }}
                      />
                    )
                  }}
                >
                  <Plus className='size-4' />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value={Sessions.SETTINGS}>
            <AccordionTrigger>Configurações</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-6'>
              <div className='flex flex-col gap-2.5'>
                <FormField
                  control={form.control}
                  name='schedulerColor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione a cor do calendário: </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='color'
                          placeholder='Selecione uma cor...'
                          defaultValue='#624f96'
                          className='p-1'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}
