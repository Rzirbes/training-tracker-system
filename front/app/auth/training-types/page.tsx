import { Suspense } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
} from '@/components/ui'
import List from './list'
import { Create } from './create'
import { SearchInput } from '@/components/ui/search-input'
import { RouteEnum } from '@/enums'

interface Props {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AthleteList({ searchParams }: Props) {
  const { page = '1', search = '' } = searchParams

  return (
    <section className='p-4 px-10'>
      <div className='flex flex-col gap-0.5'>
        <h1 className='text-xl font-semibold'>Lista de Tipos de Treino</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tipos de Treino</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='pt-6 flex justify-between flex-wrap sm:flex-nowrap gap-4'>
        <SearchInput placeholder='Procure pelo tipo de treino...' value={search as string} />
        <Create />
      </div>
      <Suspense
        fallback={
          <div className='mt-6 w-full h-full flex justify-center items-center'>
            <Skeleton className='w-full h-[200px] sm:h-[400px] rounded-md' />
          </div>
        }
      >
        <List page={page as string} search={search as string} />
      </Suspense>
    </section>
  )
}
