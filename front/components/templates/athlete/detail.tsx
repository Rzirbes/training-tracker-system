'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { serverFetcher } from '@/services'
import { RouteEnum } from '@/enums'
import { ImageIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { buildingRouteWithId } from '@/lib/utils'
import { useAuthContext } from '@/contexts'
import { Suspense } from 'react'
import { useSWR } from '@/lib/swr'
import { AthleteContextProvider } from '@/contexts/athlete'
import type { AthleteProps } from '@/types'

interface Props {
  isAdmin: boolean
  children: React.ReactNode
}

enum TabsEnum {
  TRAINING_PLANNING = 'training-planning',
  MONITORING = 'monitoring',
  TRAINING = 'training',
  UPDATE = 'update',
  INJURIES = 'injuries',
  PAINS = 'pains',
  INFO = 'info',
}

const defaultTabByRoute = {
  [TabsEnum.TRAINING_PLANNING]: TabsEnum.TRAINING_PLANNING,
  [TabsEnum.MONITORING]: TabsEnum.MONITORING,
  [TabsEnum.TRAINING]: TabsEnum.TRAINING,
  [TabsEnum.UPDATE]: TabsEnum.UPDATE,
  [TabsEnum.INJURIES]: TabsEnum.INJURIES,
  [TabsEnum.PAINS]: TabsEnum.PAINS,
  [TabsEnum.INFO]: TabsEnum.INFO,
} as Record<string, TabsEnum>

export function AthleteDetailTemplate({ id, children }: { id: string;  children: React.ReactNode }) {
  const { isAdmin } = useAuthContext()

  const endpoint = `athletes/${id}`

  const { data: athlete = {} as AthleteProps, isLoading, isValidating, mutate } = useSWR(endpoint, async () => {
    if (!id) return

    const res = await serverFetcher<AthleteProps>(endpoint)

    if (res.ok) {
      return { ...res.data, birthday: new Date(res.data.birthday)}
    }
  }, {
    revalidateOnFocus: false,
  })

  return (
    <Skeleton isLoaded={!isLoading}>
      <AthleteContextProvider context={{ athlete, mutate, isLoading: isLoading || isValidating }}>
        <section className='w-full h-full p-4 px-6 lg:px-10'>
          <div className='flex gap-8 items-center'>
            {!isLoading && (
              <Avatar className='h-16 w-16  shadow'>
                <AvatarImage src={athlete?.avatarUrl} alt='Preview' />
                <AvatarFallback>
                  <ImageIcon className='h-8 w-8' />
                </AvatarFallback>
              </Avatar>
            )}
            <div className='flex flex-col gap-0.5 sticky'>
              <div className='flex gap-1 items-center'>
                <h1 className='text-xl font-semibold'>Atleta - </h1>
                <h1 className='text-xl font-semibold text-primary-medium'>{athlete?.name}</h1>
              </div>
              <Breadcrumb className='print:hidden'>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={RouteEnum.AUTHENTICATED}>Inicio</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={RouteEnum.ATHLETES}>Atletas</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Detalhes do atleta</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className='w-full h-full pt-6 flex'>
            <TabsComponents {...{ isAdmin }}>{children}</TabsComponents>
          </div>
        </section>
      </AthleteContextProvider>
    </Skeleton>
  )
}

 function TabsComponents({ children, isAdmin }: Props) {
   const paths = usePathname().split('/')
   const route = paths[4] 
   const athleteId = paths[3]

   return (
     <Tabs value={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
       {/* {isAdmin && ( */}
       <TabsList className='w-full md:w-fit print:hidden'>
         <TabsTrigger href={buildingRouteWithId(RouteEnum.MONITORY, athleteId)} value={TabsEnum.MONITORING}>
           Monitoramento
         </TabsTrigger>
         <TabsTrigger href={buildingRouteWithId(RouteEnum.DETAIL_ATHLETE, athleteId)} value={TabsEnum.INFO}>
           Informações
         </TabsTrigger>
         <TabsTrigger
           href={buildingRouteWithId(RouteEnum.TRAINING_PLANNING, athleteId)}
           value={TabsEnum.TRAINING_PLANNING}
         >
           Treinos Planejados
         </TabsTrigger>
         <TabsTrigger href={buildingRouteWithId(RouteEnum.TRAININGS, athleteId)} value={TabsEnum.TRAINING}>
           Treinos Concluídos
         </TabsTrigger>
         <TabsTrigger href={buildingRouteWithId(RouteEnum.PAINS, athleteId)} value={TabsEnum.PAINS}>
           Histórico de Dores
         </TabsTrigger>
         <TabsTrigger href={buildingRouteWithId(RouteEnum.INJURIES, athleteId)} value={TabsEnum.INJURIES}>
           Histórico de Lesões
         </TabsTrigger>
       </TabsList>
       {/* )} */}
       {children}
     </Tabs>
   )
 }
