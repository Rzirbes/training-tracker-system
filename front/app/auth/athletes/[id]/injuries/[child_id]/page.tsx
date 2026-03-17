import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { InjuryTemplateProps } from '@/components/templates'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Separator,
} from '@/components/ui'
import { buildingRouteWithId } from '@/lib/utils'
import { bodySides, degreeLabels, injuryContexts, RouteEnum } from '@/enums'
import { serverFetcher } from '@/services'
import { IPageProps } from '@/types'

type InjuryProps = InjuryTemplateProps['InjuryForm']['injuries'][number]

export default async function InjuryDetailsPage({ params }: IPageProps) {
  const { id: athleteId = '', child_id: injuryId = '' } = params

  const endpoint = `injuries/${injuryId}`

  const response = await serverFetcher(endpoint, {
    method: 'GET',
    next: { tags: [endpoint] },
  })

  const injury: InjuryProps = response.data ?? ({} as InjuryProps)

  return (
    <div className='w-full pb-8 flex flex-col gap-2'>
      <div className='flex gap-4 justify-between'>
        <Link className='w-fit' href={buildingRouteWithId(RouteEnum.INJURIES, athleteId as string)} tabIndex={-1}>
          <Button className='w-fit' variant='outline'>
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <Link
          className='w-fit'
          href={buildingRouteWithId(RouteEnum.UPDATE_INJURY, athleteId as string, injuryId as string)}
          tabIndex={-1}
        >
          <Button className='w-fit' variant='secondary'>
            <Edit /> Editar
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Lesão</CardTitle>
          <CardDescription className='text-md'>{injury.type}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field label='Data da lesão' value={new Date(injury?.date).toLocaleDateString('pt-BR')} />
            <Field label='Região do corpo' value={injury.bodyRegion} />
            <Field label='Lado' value={bodySides[injury.bodySide]} />
            <Field label='Grau' value={degreeLabels[injury.degree]} />
            <Field label='Ocorrida durante' value={injuryContexts[injury.occurredDuring]} />
            {injury.examType && <Field label='Tipo de exame' value={injury.examType} />}
            {injury.treatmentType && <Field label='Tipo de tratamento' value={injury.treatmentType} />}
            {injury.returnDatePlanned && (
              <Field
                label='Retorno planejado'
                value={new Date(injury?.returnDatePlanned).toLocaleDateString('pt-BR')}
              />
            )}
            {injury.returnDateActual && (
              <Field label='Retorno real' value={new Date(injury?.returnDateActual).toLocaleDateString('pt-BR')} />
            )}
            {!!injury.minutesFirstGame && <Field label='Minutos no 1º jogo' value={`${injury.minutesFirstGame} min`} />}
          </div>

          <Separator />

          <div className='flex flex-wrap gap-4'>
            <Badge variant={injury.diagnosisConfirmed ? 'default' : 'outline'}>
              Diagnóstico: {injury.diagnosisConfirmed ? 'Confirmado' : 'Não confirmado'}
            </Badge>
            <Badge variant={injury.requiresSurgery ? 'default' : 'outline'}>
              Cirurgia: {injury.requiresSurgery ? 'Sim' : 'Não'}
            </Badge>
            {injury.requiresSurgery && injury.surgeryDate && (
              <Badge variant='secondary'>
                Data da cirurgia: {new Date(injury?.surgeryDate).toLocaleDateString('pt-BR')}
              </Badge>
            )}
          </div>

          {injury.description && (
            <div>
              <Label className='text-sm text-muted-foreground'>Descrição</Label>
              <p className='text-sm mt-1'>{injury.description}</p>
            </div>
          )}

          {injury.notes && (
            <div>
              <Label className='text-sm text-muted-foreground'>Observações</Label>
              <p className='text-sm mt-1'>{injury.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className='text-sm text-muted-foreground'>{label}</Label>
      <p className='text-sm'>{value}</p>
    </div>
  )
}
