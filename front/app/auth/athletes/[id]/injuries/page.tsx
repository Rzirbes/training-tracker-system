import { Info, PackageOpen, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableCaption,
  TableCell,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  TableTd,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Badge,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { InjuryDashboard, InjuryListOptions } from '@/components/compositions'
import { IPageProps } from '@/types'
import Link from 'next/link'
import { buildingRouteWithId } from '@/lib/utils'

interface InjuryProps {
  id: string
  date: Date
  type: string
  bodyRegion: string
  bodySide: string
  degree: string
  occurredDuring: string
  description?: string
  diagnosisConfirmed?: boolean
  examType?: string
  requiresSurgery?: boolean
  surgeryDate?: Date
  treatmentType?: string
  returnDatePlanned?: Date
  returnDateActual?: Date
  minutesFirstGame?: number
  notes?: string
}

interface InjuryList {
  data: InjuryProps[]
  page: number
  lastPage: number
  size: number
  total: number
}

export default async function InjuryHistory({ params, searchParams }: IPageProps) {
  const { id: athleteId = '' } = params
  const { page = '1', search = '' } = searchParams

  const tag = `athlete-${athleteId}-injuries`
  const response = await serverFetcher<InjuryList>(`injuries?athleteUuid=${athleteId}&page=${page}&search=${search}`, {
    method: 'GET',
    next: { tags: [tag] },
  })

  const injuries: InjuryProps[] = response?.data?.data ?? []

  const injuryDetailsRoute = (id: string) => buildingRouteWithId(RouteEnum.INJURY_DETAIL, athleteId, id)

  return (
    <>
      <Card>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle className='py-4'>Histórico</CardTitle>
          <Link href={buildingRouteWithId(RouteEnum.CREATE_INJURY, athleteId)} tabIndex={-1}>
            <Button>
              <Plus />
              Cadastrar Lesão
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Grau</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Lado</TableHead>
                  <TableHead>Momento da lesão</TableHead>
                  <TableHead>Diagnóstico confirmado</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!!injuries?.length &&
                  injuries.map(
                    ({ id, date, type, degree, bodyRegion, bodySide, occurredDuring, diagnosisConfirmed }) => (
                      <TableRow key={id}>
                        <TableCell href={injuryDetailsRoute(id)} title={new Date(date).toLocaleDateString('pt-BR')}>
                          {new Date(date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className='font-bold' href={injuryDetailsRoute(id)} title={type}>
                          <Badge>{type}</Badge>
                        </TableCell>
                        <TableCell href={injuryDetailsRoute(id)} title={degree}>
                          {degree}
                        </TableCell>
                        <TableCell href={injuryDetailsRoute(id)} title={bodyRegion}>
                          {bodyRegion}
                        </TableCell>
                        <TableCell href={injuryDetailsRoute(id)} title={bodySide}>
                          {bodySide}
                        </TableCell>
                        <TableCell href={injuryDetailsRoute(id)} title={occurredDuring}>
                          {occurredDuring}
                        </TableCell>
                        <TableCell
                          className='text-center md:w-[80px]'
                          href={injuryDetailsRoute(id)}
                          title={diagnosisConfirmed ? 'Sim' : 'Não'}
                        >
                          {diagnosisConfirmed ? 'Sim' : 'Não'}
                        </TableCell>
                        <TableTd className='flex justify-end w-full'>
                          <InjuryListOptions {...{ athleteId, injuryId: id, tag }} />
                        </TableTd>
                      </TableRow>
                    )
                  )}
              </TableBody>
              {!injuries?.length && (
                <TableCaption className='py-2 px-4 pb-6 text-primary-medium font-medium'>
                  <PackageOpen size={64} strokeWidth={1} />
                  {search
                    ? 'Não encontramos nenhuma lesão com esse filtro...'
                    : 'O atleta ainda não possui histórico de lesões!'}
                </TableCaption>
              )}
            </Table>
          </div>
          <Pagination
            page={Number(page)}
            lastPage={response?.data?.lastPage}
            total={response?.data?.total}
            className='mt-6 justify-end'
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='py-4 flex gap-2 items-center'>
            Métricas
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className='size-5' />
                </TooltipTrigger>
                <TooltipContent>Métricas de todas as Lesões do atleta</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InjuryDashboard athleteId={athleteId} />
        </CardContent>
      </Card>
    </>
  )
}
