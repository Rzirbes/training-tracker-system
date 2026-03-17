import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Button,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui'
import { RouteEnum } from '@/enums'
import { serverFetcher } from '@/services'
import { getCities, getCountries, getStates } from '@/hooks'
import { TeamMemberForm } from '../../_components/form'
import type { ITeamMemberFormProps } from '../../_schema'
import type { IPageProps } from '@/types'

interface ITeamMemberProps {
  id: string
  name: string
  email: string
  isEnabled: boolean
  role: string
  schedulerColor: string
  address: {
    buildingNumber?: string
    street?: string
    zipCode?: string
    neighborhood?: string
    complement?: string
    countryId?: string
    cityId?: string
    stateId?: string
  }
}

export default async function TeamMemberPage({ params }: IPageProps) {
  const { id } = params
  const teamMember = await serverFetcher<ITeamMemberProps>('coaches/'.concat(id as string))

  if (!teamMember.ok) redirect(RouteEnum.TEAM_MEMBERS)

  async function onSubmit(data: ITeamMemberFormProps) {
    'use server'
    return serverFetcher('coaches/'.concat(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  return (
    <div className='flex flex-col justify-center w-full gap-1 relative h-full py-4 px-2'>
      <header className='flex flex-col gap-0.5 px-6 md:px-8'>
        <h1 className='text-xl font-semibold'>Cadastrar colaborador</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={RouteEnum.TEAM_MEMBERS}>Colaboradores</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Criar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className='mt-4'>Preencha os campos a seguir para cadastrar o colaborador.</p>
      </header>
      <div className='px-6 md:px-8'>
        <TeamMemberForm onSubmit={onSubmit} defaultValues={teamMember.data} />
        <footer className='flex flex-row justify-between mb-4 py-4 w-full sm:w-2/3 md:max-w-[40%]'>
          <Link href={RouteEnum.TEAM_MEMBERS} className='w-fit' tabIndex={-1}>
            <Button variant='outline'>Cancelar</Button>
          </Link>
          <Button form='collaborator' className='w-fit' type='submit'>
            Editar
          </Button>
        </footer>
      </div>
    </div>
  )
}
