import { PackageOpen } from 'lucide-react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Pagination,
  TableCaption,
  TableCell,
  TableTd,
  StatusBadge,
} from '@/components/ui'
import { CoachListOptions } from './_components'
import { getCoachesAction } from './_action'
import { RouteEnum } from '@/enums'

interface Props {
  page: string
  search: string
  status: string
}

export default async function List({ page, search, status }: Props) {
  const { coaches, lastPage, total } = await getCoachesAction(page, search, status)

  const coachDetailsRoute = (id: string) => RouteEnum.UPDATE_TEAM_MEMBERS.replace(':ID', id)

  return (
    <>
      <div className='rounded-md border mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='whitespace-nowrap'>Cor do Calendário</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!coaches?.length &&
              coaches.map(({ id, name, email, isEnabled, role, schedulerColor }) => (
                <TableRow key={id}>
                  <TableCell href={coachDetailsRoute(id)} title={email}>
                    {name}
                  </TableCell>
                  <TableCell href={coachDetailsRoute(id)} title={email}>
                    {email}
                  </TableCell>
                  <TableCell href={coachDetailsRoute(id)} title={role}>
                    {role || '-'}
                  </TableCell>
                  <TableCell href={coachDetailsRoute(id)}>
                    <StatusBadge {...{ isEnabled }} />
                  </TableCell>
                  <TableCell href={coachDetailsRoute(id)}>
                    <div
                      className='w-8 h-8 rounded-sm text-transparent mx-auto ml-9'
                      style={{ backgroundColor: schedulerColor }}
                    />
                  </TableCell>
                  <TableTd className='flex justify-end w-full'>
                    <CoachListOptions {...{ id, isEnabled }} />
                  </TableTd>
                </TableRow>
              ))}
          </TableBody>
          {!coaches?.length && (
            <TableCaption className='py-2 px-4 pb-6 text-primary-medium font-medium'>
              <PackageOpen size={64} strokeWidth={1} />
              {search ? 'Não encontramos nenhum colaborador com esse filtro...' : 'A lista está vazia...'}
              <br />
              {!search && 'Experimente cadastrar um novo colaborador!'}
            </TableCaption>
          )}
        </Table>
      </div>
      <Pagination page={Number(page)} lastPage={lastPage} total={total} className='mt-6 justify-end' />
    </>
  )
}
