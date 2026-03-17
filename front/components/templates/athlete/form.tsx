'use client'

import Link from 'next/link'
import { z } from 'zod'
import { startTransition } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  Button,
  DatePicker,
  Details,
  AvatarPicker,
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
  Badge,
  Switch,
} from '@/components/ui'
import { mask } from '@/utils/mask'
import { dominantFootLabel, DominantFoot, FootballPosition, footballPositionLabels, RouteEnum } from '@/enums'
import { Plus, Trash } from 'lucide-react'
import { PainTemplate } from '../pain'
import { InjuryTemplate } from '../injury'
import { buildingRouteWithId } from '@/lib/utils'
import { validator } from '@/utils/validator'
import { schemas } from '@/schemas'
import { useCities, useCountries, useStates } from '@/hooks'
import { useDialogContext } from '@/contexts'
import { AddressTemplate } from '../address'
import { ClubTemplate } from '../clubs'
import { MultiSelect } from '@/components/ui/multi-select'

interface Props {
  type?: 'create' | 'update'
  onSubmit: (data: IAthleteFormProps) => Promise<void>
  athleteId?: string
}

export type IAthleteFormProps = z.input<typeof athleteSchema>

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const fileSchema = z
  .custom<File>((file) => file instanceof File || file === undefined, {
    message: 'Arquivo inválido.',
  })
  .optional()
  .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Tamanho máximo de arquivo é 5MB.`)
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'É suportado apenas arquivos nos formatos .jpg, .jpeg e .png.'
  )

export const athleteSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'Nome é obrigatório' }).default(''),
    email: z.string().trim().min(1, { message: 'E-mail é obrigatório' }).email('E-mail inválido').default(''),
    birthday: z.date({ message: 'Data de nascimento é obrigatória' }),
    height: z.coerce.number().max(5, 'Altura máxima é 3 metros').optional(),
    weight: z.coerce.number().max(600, 'Peso máximo é 600 kilos').optional(),
    phone: z
      .string()
      .trim()
      .min(11, { message: 'Celular é obrigatório' })
      .max(22, { message: 'Celular deve ter no máximo 22 digítos' })
      .default(''),
    cpf: z
      .string()
      .trim()
      // .min(11, { message: 'CPF é obrigatório' })
      .max(14, { message: 'CPF deve ter no máximo 14 digítos' })
      .default('')
      .optional()
      .refine((cpf) => !cpf || validator.cpf(cpf), 'CPF inválido'),
    positions: z
      .array(
        z.nativeEnum(FootballPosition, {
          errorMap: () => ({ message: 'Selecione uma ou mais posições' }),
        })
      )
      .optional()
      .default([]),
    dominantFoot: z
      .nativeEnum(DominantFoot, {
        errorMap: () => ({ message: 'Selecione o pé dominante' }),
      })
      .optional(),
    bestSkill: z.string().max(100).optional().default(''),
    worstSkill: z.string().max(100).optional().default(''),
    goal: z.string().max(300).optional().default(''),
    observation: z.string().max(500, 'Obervações deve conter no máximo 500 caracteres').optional().default(''),
    avatar: fileSchema,
    address: schemas.address,
    // photos: z.array(fileSchema).optional(),
    serverError: z.string().default('').optional(),
    avatarUrl: z.string().default('').optional(),
    deletedAvatar: z.boolean().default(false).optional(),
    isMonitorDaily: z.boolean().default(true).optional(),
  })
  .and(InjuryTemplate.schema)
  .and(PainTemplate.schema)
  .and(ClubTemplate.schema)
  .transform(
    ({
      email,
      name,
      birthday,
      height,
      weight,
      cpf,
      phone,
      positions,
      dominantFoot,
      bestSkill,
      worstSkill,
      goal,
      observation,
      avatar,
      // photos,
      injuries,
      pains,
      address,
      deletedAvatar,
      clubs,
      isMonitorDaily,
    }) => ({
      email,
      name,
      birthday,
      height,
      weight,
      cpf,
      phone,
      positions,
      dominantFoot,
      bestSkill,
      worstSkill,
      goal,
      observation,
      avatar,
      // photos,
      injuries,
      pains,
      address,
      deletedAvatar,
      clubs,
      isMonitorDaily,
    })
  )

export function AthleteForm({ athleteId, type = 'create', onSubmit }: Props) {
  const { dialog } = useDialogContext()
  const form = useFormContext<IAthleteFormProps>()

  const { control, watch } = form

  const actionText = {
    create: 'Cadastrar',
    update: 'Editar',
  }[type]

  const injuries = useFieldArray({
    control,
    name: 'injuries',
  })

  const pains = useFieldArray({
    control,
    name: 'pains',
  })

  const clubs = useFieldArray({
    control,
    name: 'clubs',
  })

  const hasManyPains = pains.fields.length > 1
  const hasManyInjuries = pains.fields.length > 1
  const hasManyClubs = clubs.fields.length > 1

  const countryId = watch('address.countryId')
  const stateId = watch('address.stateId')

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
    <form
      id='athlete'
      onSubmit={form.handleSubmit(onSubmit)}
      className='flex flex-col gap-4 text-left py-4 min-h-full sm:w-2/3 md:w-3/6 h-full'
    >
      <Details.Root open>
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title={`Informações Básicas.`}
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} as informações básicas do atleta na plataforma`}
          />
        </Details.Summary>
        <Details.Body>
          <AvatarPicker
            name='avatar'
            label='Foto do Atleta'
            accept={ACCEPTED_IMAGE_TYPES}
            defaultImageUrl={form.watch('avatarUrl') as string}
            onDelete={() => form.setValue('deletedAvatar', true)}
          />

          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Atleta</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='Digite o nome completo...'
                    onChange={(e) =>
                      form.setValue('name', mask.name(e.target?.value), {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  />
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
            name='cpf'
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Digite o CPF...' mask={mask.cpf} maxLength={14} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DatePicker
            control={form.control}
            name='birthday'
            label='Data de nascimento'
            disabled={(date) => date > new Date()}
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
                    mask={mask.phone(watch('phone'))}
                    maxLength={22}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isMonitorDaily'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel className='mb-0'>Monitorar Bem-estar diariamente?</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='serverError'
            render={({ field }) => <input type='hidden' {...field} />}
          />
        </Details.Body>
      </Details.Root>

      <Details.Root>
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title={`Características.`}
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} as informações detalhadas do atleta.`}
          />
        </Details.Summary>
        <Details.Body>
          <FormField
            control={form.control}
            name='dominantFoot'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pé dominante</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DominantFoot).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {dominantFootLabel[label]}
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
            name='positions'
            render={({ field }) => (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel>Posições em Campo</FormLabel>
                <FormControl>
                  <div className='w-full'>
                    <MultiSelect
                      placeholder='Selecione as posições'
                      options={Object.entries(FootballPosition).map(([value, label]) => ({
                        value,
                        label: footballPositionLabels[label],
                      }))}
                      selected={field.value || []}
                      onChange={field.onChange}
                      className={{
                        trigger: 'md:w-full md:min-w-full',
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
                {!!field?.value?.length && (
                  <div className='mt-2 text-sm text-muted-foreground flex gap-2 flex-wrap'>
                    {field.value.map((v) => (
                      <Badge key={v} variant='secondary'>
                        {footballPositionLabels[FootballPosition[v as keyof typeof FootballPosition]]}
                      </Badge>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='height'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (em metros)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Adicione a altura do atleta...' type='number' step='0.01' max={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='weight'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Adicione o peso do atleta...' type='number' step='1' max={600} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bestSkill'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maior Qualidade</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Visão de jogo, passe, finalização...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='worstSkill'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maior Defeito</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ex: Finalização, marcação, físico...' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='goal'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Qual é o maior objetivo do atleta?' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='observation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder='Alguma observação adicional...' maxLength={500} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
          control={form.control}
          name='photos'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fotos (URLs separadas por vírgula)</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  value={field.value?.join(', ') || ''}
                  onChange={(e) => field.onChange(e.target.value.split(',').map((s) => s.trim()))}
                  placeholder='Cole as URLs das fotos separadas por vírgula...'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

          <FormField
            control={form.control}
            name='serverError'
            render={({ field }) => <input type='hidden' {...field} />}
          />
        </Details.Body>
      </Details.Root>

      <Details.Root>
        <Details.Summary>
          <Details.Header
            title='Endereço do atleta'
            description='Preencha as informações de acordo com o endereço atual do atleta.'
          />
        </Details.Summary>
        <Details.Body>
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
        </Details.Body>
      </Details.Root>

      <Details.Root>
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title='Histórico de Clubes'
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} histórico de clubes do atleta.`}
          />
        </Details.Summary>
        <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
          <ul className='mb-4 flex flex-col gap-4 md:gap-3 divide-y-2'>
            {clubs.fields.map((club, index) => (
              <li key={club.id.concat(`-${index}`)} className='py-4'>
                <div className='flex gap-4 justify-between'>
                  <p className='text-lg py-2'>Clube {hasManyClubs ? `- ${index + 1}` : ''}</p>
                  <Button type='button' className='h-8' variant='ghost' onClick={() => clubs.remove(index)}>
                    <Trash className='size-4' />
                  </Button>
                </div>
                <ClubTemplate.Form index={index} />
              </li>
            ))}
          </ul>
          <div className='w-full flex flex-col gap-2'>
            <Button
              title='Adicionar clube'
              type='button'
              variant='secondary'
              onClick={() => {
                clubs.append({} as IAthleteFormProps['clubs'][number])
                startTransition(() => {
                  form.setFocus(`clubs.${clubs.fields.length}`)
                })
              }}
            >
              <Plus className='size-4 mr-2' />
              Adicionar clube
            </Button>
            {/* {type === 'update' && (
              <Link href={buildingRouteWithId(RouteEnum.ATHLETE_INFO, athleteId)} target='_blank' rel='noopener noreferrer'>
                <Button type='button' variant='outline' className='w-full'>
                  Ver histórico
                </Button>
              </Link>
            )} */}
          </div>
        </div>
      </Details.Root>

      <Details.Root>
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title='Histórico de Dores'
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} histórico de dores do atleta durante a carreira.`}
          />
        </Details.Summary>
        <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
          <ul className='mb-4 flex flex-col gap-4 md:gap-3 divide-y-2'>
            {pains.fields.map((pain, index) => (
              <li key={pain.id} className='py-4'>
                <div className='flex gap-4 justify-between'>
                  <p className='text-lg py-2'>Dor muscular {hasManyPains ? `- ${index + 1}` : ''}</p>
                  <Button type='button' className='h-8' variant='ghost' onClick={() => pains.remove(index)}>
                    <Trash className='size-4' />
                  </Button>
                </div>
                <PainTemplate.Form index={index} />
              </li>
            ))}
          </ul>
          <div className='w-full flex flex-col gap-2'>
            <Button
              title='Adicionar dor muscular'
              type='button'
              variant='secondary'
              onClick={() => {
                pains.append({} as IAthleteFormProps['pains'])
                form.setFocus(`pains.${pains.fields.length}`)
              }}
            >
              <Plus className='size-4 mr-2' />
              Adicionar dor muscular
            </Button>
            {type === 'update' && (
              <Link href={buildingRouteWithId(RouteEnum.PAINS, athleteId)} target='_blank' rel='noopener noreferrer'>
                <Button type='button' variant='outline' className='w-full'>
                  Ver histórico
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Details.Root>

      <Details.Root>
        <Details.Summary className='cursor-pointer list-none p-4 flex items-center justify-between'>
          <Details.Header
            title='Histórico de Lesões'
            description={`Preencha os campos a seguir para ${actionText.toLowerCase()} histórico de lesões do atleta durante a carreira.`}
          />
        </Details.Summary>
        <div className='w-full p-4 pt-0 flex flex-col gap-4 md:gap-3'>
          <ul className='mb-4 flex flex-col gap-4 md:gap-3 divide-y-2'>
            {injuries.fields.map((injury, index) => (
              <li key={injury.id} className='py-4'>
                <div className='flex gap-4 justify-between'>
                  <p className='text-lg py-2'>Lesão {hasManyInjuries ? `- ${index + 1}` : ''}</p>
                  <Button type='button' className='h-8' variant='ghost' onClick={() => injuries.remove(index)}>
                    <Trash className='size-4' />
                  </Button>
                </div>
                <InjuryTemplate.Form index={index} />
              </li>
            ))}
          </ul>
          <div className='w-full flex flex-col gap-2'>
            <Button
              title='Adicionar lesão'
              type='button'
              variant='secondary'
              onClick={() => {
                injuries.append({} as IAthleteFormProps['injuries'])
                form.setFocus(`injuries.${injuries.fields.length}`)
              }}
            >
              <Plus className='size-4 mr-2' />
              Adicionar lesão
            </Button>
            {type === 'update' && (
              <Link href={buildingRouteWithId(RouteEnum.INJURIES, athleteId)} target='_blank' rel='noopener noreferrer'>
                <Button type='button' variant='outline' className='w-full'>
                  Ver histórico
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Details.Root>
    </form>
  )
}
