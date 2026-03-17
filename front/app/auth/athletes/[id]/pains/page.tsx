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
import { PainDashboard, PainListOptions } from '@/components/compositions'
import { IPageProps } from '@/types'
import Link from 'next/link'
import { buildingRouteWithId } from '@/lib/utils'

interface PainProps {
  id: string
  date: Date
  intensity: number
  bodyRegion: string
  bodySide: string
  occurredDuring: string
  description?: string
}

interface PainList {
  data: PainProps[]
  page: number
  lastPage:number
  size: number
  total: number
}

export default async function InjuryHistory({ params, searchParams }: IPageProps) {
  const {  id: athleteId = '' } = params
  const { page = '1', search = '' } = searchParams
  
  const tag = `athlete-${athleteId}-pains`
  const response = await serverFetcher<PainList>(`pains?athleteUuid=${athleteId}&page=${page}&search=${search}`, {
    method: 'GET',
    next: { tags: [tag] },
  })

  const pains: PainProps[] = response?.data?.data ?? []

  const painDetailsRoute = (id: string) => buildingRouteWithId(RouteEnum.PAIN_DETAIL, athleteId, id)

  return (
    <>
      <Card>
        <CardHeader className='flex-row justify-between items-center'>
          <CardTitle className='py-4'>Histórico</CardTitle>
          <Link href={buildingRouteWithId(RouteEnum.CREATE_PAIN, athleteId)} tabIndex={-1}>
            <Button>
              <Plus />
              Cadastrar Dores
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Intensidade</TableHead>
                  <TableHead>Lado</TableHead>
                  <TableHead>Ocorreu durante</TableHead>
                  <TableHead className='text-right'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!!pains?.length &&
                  pains.map(({ id, date, intensity, bodyRegion, bodySide, occurredDuring }) => (
                    <TableRow key={id}>
                      <TableCell href={painDetailsRoute(id)} title={new Date(date).toLocaleDateString('pt-BR')}>
                        {new Date(date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell href={painDetailsRoute(id)} title={bodyRegion}>
                        {bodyRegion}
                      </TableCell>
                      <TableCell
                        className='px-6 px-auto text-center'
                        href={painDetailsRoute(id)}
                        title={String(`Intensidade: ${intensity}`)}
                      >
                        <Badge className='w-full'>{intensity}</Badge>
                      </TableCell>
                      <TableCell href={painDetailsRoute(id)} title={bodySide}>
                        {bodySide}
                      </TableCell>
                      <TableCell href={painDetailsRoute(id)} title={occurredDuring}>
                        {occurredDuring}
                      </TableCell>
                      <TableTd className='flex justify-end w-full'>
                        <PainListOptions {...{ athleteId, painId: id, tag }} />
                      </TableTd>
                    </TableRow>
                  ))}
              </TableBody>
              {!pains?.length && (
                <TableCaption className='py-2 px-4 pb-6 text-primary-medium font-medium'>
                  <PackageOpen size={64} strokeWidth={1} />
                  {search
                    ? 'Não encontramos nenhuma dor com esse filtro...'
                    : 'O atleta ainda não possui histórico de dores!'}
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
          <PainDashboard athleteId={athleteId} />
        </CardContent>
      </Card>
    </>
  )
}
