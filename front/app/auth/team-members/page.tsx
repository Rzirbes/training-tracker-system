import Link from 'next/link'
import { Suspense } from 'react'
import { Plus } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  SearchInput,
  Skeleton,
} from '@/components/ui'
import List from './list'
import { RouteEnum } from '@/enums'
import { StatusFilter } from './_components/status-filter'

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined
    status?: string

  }
}

export default async function TeamMembersList({ searchParams }: Props) {
  const { page = '1', search = '', isEnabled = 'true' } = searchParams

  return (
    <section className='w-full h-full p-4 px-6 md:px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Lista de Colaboradores</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Colaboradores</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='pt-6 flex justify-between flex-wrap sm:flex-nowrap gap-4'>
        <SearchInput placeholder='Procure pelo nome ou e-mail...' value={search as string} />
        <div className='flex gap-4 flex-wrap sm:flex-nowrap'>
          <StatusFilter status={isEnabled as string} />
        </div>
        <Link href={RouteEnum.CREATE_TEAM_MEMBERS} className='w-full md:w-fit'>
          <Button className='w-full md:w-fit px-6 md:px-10'>
            <Plus />
            Cadastrar Colaborador
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className='mt-6 w-full h-full flex justify-center items-center'>
            <Skeleton className='w-full h-[200px] sm:h-[400px] rounded-md' />
          </div>
        }
      >
        <List page={page as string} search={search as string} status={isEnabled as string} />
      </Suspense>
    </section>
  )
}
