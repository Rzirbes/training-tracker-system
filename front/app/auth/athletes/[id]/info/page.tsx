'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Label } from '@/components/ui'
import { useAthleteContext } from '@/contexts/athlete'
import { buildingRouteWithId } from '@/lib/utils'
import { bodySides, degreeLabels, dominantFootLabel, footballPositionLabels, injuryContexts, RouteEnum } from '@/enums'
import { useAuthContext } from '@/contexts'

export default function AthleteDetailsPage() {
  const { athlete, mutate } = useAthleteContext()
  const { isAdmin } = useAuthContext()

  useEffect(() => {
    mutate()
  }, [])

  return (
    <div className='w-full flex flex-col gap-4'>
      <Card>
        <CardHeader className='flex flex-row justify-between items-start pt-4'>
          <div className='flex flex-col space-y-1.5 mt-2.5'>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados cadastrais do atleta</CardDescription>
          </div>
          {isAdmin && (
            <Link className='w-fit' href={buildingRouteWithId(RouteEnum.UPDATE_ATHLETE, athlete.id)} tabIndex={-1}>
              <Button variant='outline'>
                <Edit className='size-5' /> Editar
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field label='Nome' value={athlete.name} />
          <Field label='E-mail' value={athlete.email} />
          <Field label='CPF' value={athlete.cpf || '-'} />
          <Field label='Data de nascimento' value={new Date(athlete.birthday).toLocaleDateString('pt-BR')} />
          <Field label='Ativo no sistema' value={athlete.isEnabled ? 'Sim' : 'Não'} />
          <Field label='Celular' value={athlete?.phone || '-'} />
          <Field label='Monitorado diariamente' value={athlete.isMonitorDaily ? 'Sim' : 'Não'} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
          <CardDescription>Características técnicas e físicas</CardDescription>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field label='Altura' value={athlete.height ? `${athlete.height} cm` : '-'} />
          <Field label='Peso' value={athlete.weight ? `${athlete.weight} kg` : '-'} />
          {!!athlete.position && (
            <Field label='Posição' value={athlete.positions.map((position) => footballPositionLabels[position])} />
          )}
          {!!athlete.dominantFoot && <Field label='Pé dominante' value={dominantFootLabel[athlete.dominantFoot]} />}
          {!!athlete.bestSkill && <Field label='Melhor habilidade' value={athlete.bestSkill} />}
          {!!athlete.worstSkill && <Field label='Pior habilidade' value={athlete.worstSkill} />}
          {!!athlete.goal && <Field label='Meta' value={athlete.goal} />}
        </CardContent>
      </Card>

      {!!athlete.address && (
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Local de residência atual do atleta</CardDescription>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {!!athlete.address?.country && <Field label='País' value={athlete.address?.country} />}
            {!!athlete.address?.street && <Field label='Rua' value={athlete.address?.street} />}
            {!!athlete.address?.state && <Field label='Estado' value={athlete.address?.state} />}
            {!!athlete.address?.buildingNumber && <Field label='Número' value={athlete.address?.buildingNumber} />}
            {!!athlete.address?.city && <Field label='Cidade' value={athlete.address?.city} />}
            {!!athlete.address?.neighborhood && <Field label='Bairro' value={athlete.address?.neighborhood} />}
            {!!athlete.address?.zipCode && <Field label='CEP' value={athlete.address?.zipCode} />}
            {!!athlete.address?.complement && <Field label='Complemento' value={athlete.address?.complement} />}
          </CardContent>
        </Card>
      )}

      {athlete.observation && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>{athlete.observation}</p>
          </CardContent>
        </Card>
      )}

      {!!athlete.clubs?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Clubes</CardTitle>
            <CardDescription>Resumo de todos os clubes defendidos pelo atleta</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {athlete.clubs.map((club) => {
              const startDate = new Date(club.startDate).toLocaleDateString('pt-BR')
              const endDate = club.endDate ? new Date(club.endDate).toLocaleDateString('pt-BR') : null

              return (
                <CompactRecordCard
                  key={club.uuid}
                  fields={[
                    { label: 'Nome do Clube', value: club.name ?? '-' },
                    { label: 'País', value: club?.country ?? '-' },
                    { label: 'Estado', value: club?.state ?? '-' },
                    { label: 'Cidade', value: club?.city ?? '-' },
                    { label: 'Início', value: startDate },
                    { label: 'Término', value: endDate ?? '-' },
                  ]}
                  badges={[
                    {
                      value: club.endDate ? 'Vínculo encerrado' : 'Vínculo ativo',
                      variant: club.endDate ? 'secondary' : 'default',
                    },
                  ]}
                />
              )
            })}
          </CardContent>
        </Card>
      )}

      {!!athlete.injuries?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Lesões</CardTitle>
            <CardDescription>Resumo clínico de lesões registradas</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {athlete.injuries.map((injury) => {
              const badges = [
                { value: injury.diagnosisConfirmed ? 'Diagnóstico confirmado' : 'Diagnóstico não confirmado' },
                { value: injury.requiresSurgery ? 'Cirurgia necessária' : 'Sem cirurgia' },
              ] as { value: string; variant?: 'default' | 'secondary' }[]

              if (!!injury?.surgeryDate) {
                badges.push({
                  value: new Date(injury.surgeryDate).toLocaleDateString(),
                  variant: 'secondary',
                })
              }

              return (
                <CompactRecordCard
                  key={injury.uuid}
                  date={injury.date.toString()}
                  title={injury.type}
                  description={injury.description}
                  fields={[
                    { label: 'Região do corpo', value: injury.bodyRegion },
                    { label: 'Lado', value: bodySides[injury.bodySide] },
                    { label: 'Grau', value: degreeLabels[injury.degree] },
                    { label: 'Ocorrida durante', value: injuryContexts[injury.occurredDuring] },
                  ]}
                  badges={badges}
                />
              )
            })}
          </CardContent>
        </Card>
      )}

      {!!athlete.pains?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Dores Musculares</CardTitle>
            <CardDescription>Relatos recentes de desconforto muscular</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            {athlete.pains.map((pain) => (
              <CompactRecordCard
                key={pain.uuid}
                date={pain.date.toString()}
                title={pain.bodyRegion}
                description={pain.description}
                fields={[
                  { label: 'Lado', value: bodySides[pain.bodySide] },
                  { label: 'Ocorrida durante', value: injuryContexts[pain.occurredDuring] },
                  { label: 'Intensidade', value: `${pain.intensity}/10` },
                ]}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | string[] }) {
  return (
    <div>
      <Label className='text-sm text-muted-foreground'>{label}</Label>
      {typeof value === 'string' ? (
        <p className='text-sm'>{value}</p>
      ) : (
        <div className='flex gap-1 items-center flex-wrap'>
          {value?.map((v) => (
            <Badge key={v} variant='secondary' className='w-fit text-nowrap'>
              {v}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function CompactRecordCard({
  date,
  title,
  description,
  fields,
  badges,
}: {
  date?: string
  title?: string
  description?: string
  fields: { label: string; value: string }[]
  badges?: { value: string; variant?: 'default' | 'secondary' }[]
}) {
  return (
    <div className='border rounded-lg p-4 space-y-2'>
     {!!title && !!date && <Field label={title} value={new Date(date).toLocaleDateString('pt-BR')} />}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4'>
        {fields.map((field) => (
          <Field key={field.label} {...field} />
        ))}
      </div>

      {!!badges?.length && (
        <>
          <hr className='p-1' />
          <div className='flex flex-wrap gap-2 mt-2'>
            {badges.map((badge, i) => (
              <Badge key={i} variant={badge?.variant ?? 'default'}>
                {badge.value}
              </Badge>
            ))}
          </div>
        </>
      )}

      {description && (
        <div>
          <Label className='text-xs text-muted-foreground'>Descrição</Label>
          <p className='text-sm'>{description}</p>
        </div>
      )}
    </div>
  )
}
