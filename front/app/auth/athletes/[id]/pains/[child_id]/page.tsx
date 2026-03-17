import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import { PainTemplateProps } from '@/components/templates'
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
import { bodySides, injuryContexts, RouteEnum } from '@/enums'
import { buildingRouteWithId } from '@/lib/utils'
import { serverFetcher } from '@/services'
import type { IPageProps } from '@/types'

type PainProps = PainTemplateProps['Form']['pains'][number]

export default async function PainDetailsPage({ params }: IPageProps) {
  const { id: athleteId = '', child_id: painId = '' } = params

  const endpoint = `pains/${painId}`

  const response = await serverFetcher(endpoint, {
    method: 'GET',
    next: { tags: [endpoint] },
  })

  const pain: PainProps = response.data ?? ({} as PainProps)

  return (
    <div className='w-full pb-8 flex flex-col gap-2'>
      <div className='flex flex-col md:flex-row gap-4 justify-between'>
        <Link
          className='w-full md:w-fit'
          href={buildingRouteWithId(RouteEnum.PAINS, athleteId as string)}
          tabIndex={-1}
        >
          <Button className='w-full md:w-fit' variant='outline'>
            <ArrowLeft /> Voltar
          </Button>
        </Link>
        <Link
          className='w-full md:w-fit'
          href={buildingRouteWithId(RouteEnum.UPDATE_PAIN, athleteId as string, painId as string)}
          tabIndex={-1}
        >
          <Button className='w-full md:w-fit' variant='secondary'>
            <Edit /> Editar
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Dor</CardTitle>
          <CardDescription className='text-md'>
            <Badge>Intensidade: {pain.intensity}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field label='Data da lesão' value={new Date(pain?.date).toLocaleDateString('pt-BR')} />
            <Field label='Região do corpo' value={pain.bodyRegion} />
            <Field label='Lado' value={bodySides[pain.bodySide]} />
            {pain.occurredDuring && <Field label='Ocorreu durante' value={injuryContexts[pain.occurredDuring]} />}
          </div>
          <Separator />
          {pain.description && (
            <div>
              <Label className='text-sm text-muted-foreground'>Descrição</Label>
              <p className='text-sm mt-1'>{pain.description}</p>
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
