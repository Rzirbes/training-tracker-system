

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
import { serverFetcher } from '@/services'
import { AthleteListOptions } from './_components'
import { RouteEnum } from '@/enums'

interface AthleteProps {
  id: string
  name: string
  email: string
  isEnabled: boolean
}

interface Props {
  page: string
  search: string
  status: string
}

export default async function List({ page, search, status }: Props) {
  const query = new URLSearchParams({ page, search })

  if (status === 'all') {
    query.delete('isEnabled')
  } else {
    query.set('isEnabled', status)
  }

  const response = await serverFetcher(`athletes?${query.toString()}`, {
    method: 'GET',
    next: { tags: ['athletes'] },
  })

  const athletes: AthleteProps[] = response?.data?.data ?? []

  const athleteDetailsRoute = (id: string) => RouteEnum.MONITORY.replace(':ID', id)

  return (
    <>
      <div className='rounded-md border mt-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do atleta</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!!athletes?.length &&
              athletes.map(({ id, name, email, isEnabled }) => (
                <TableRow key={id}>
                  <TableCell href={athleteDetailsRoute(id)} title={email}>
                    {name}
                  </TableCell>
                  <TableCell href={athleteDetailsRoute(id)} title={email}>
                    {email}
                  </TableCell>
                  <TableCell href={athleteDetailsRoute(id)}>
                    <StatusBadge {...{ isEnabled }} />
                  </TableCell>
                  <TableTd className='flex justify-end w-full'>
                    <AthleteListOptions {...{ isEnabled, id }} />
                  </TableTd>
                </TableRow>
              ))}
          </TableBody>
          {!athletes?.length && (
            <TableCaption className='py-2 px-4 pb-6 text-primary-medium font-medium'>
              <PackageOpen size={64} strokeWidth={1} />
              {search ? 'Não encontramos nenhum atleta com esse filtro...' : 'A lista está vazia...'}
              <br />
              {!search && 'Experimente cadastrar um novo atleta!'}
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
    </>
  )
}
