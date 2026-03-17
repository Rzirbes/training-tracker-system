'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'

interface Props {
  userIsAdmin: boolean
  children: React.ReactNode
}

enum TabsEnum {
  TRAINING_PLANNING = 'training-planning',
  MONITORING = 'monitoring',
  TRAINING = 'training',
  UPDATE = 'update',
  INJURIES = 'injuries',
  PAINS = 'pains',
}

const defaultTabByRoute = {
  [TabsEnum.TRAINING_PLANNING]: TabsEnum.TRAINING_PLANNING,
  [TabsEnum.MONITORING]: TabsEnum.MONITORING,
  [TabsEnum.TRAINING]: TabsEnum.TRAINING,
  [TabsEnum.UPDATE]: TabsEnum.UPDATE,
  [TabsEnum.INJURIES]: TabsEnum.INJURIES,
  [TabsEnum.PAINS]: TabsEnum.PAINS,
} as Record<string, TabsEnum>

export function TabsComponents({ children, userIsAdmin }: Props) {
  const paths = usePathname().split('/')
  const route = paths[4]
  const athleteId = paths[3]

  return (
    <Tabs value={defaultTabByRoute[route]} className='w-full flex flex-col gap-6'>
      {userIsAdmin && (
        <TabsList className='w-full md:w-fit print:hidden'>
          <TabsTrigger href={buildingRouteWithId(RouteEnum.MONITORY, athleteId)} value={TabsEnum.MONITORING}>
            Monitoramento
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
          <TabsTrigger href={buildingRouteWithId(RouteEnum.UPDATE_ATHLETE, athleteId)} value={TabsEnum.UPDATE}>
            Informações
          </TabsTrigger>
          <TabsTrigger href={buildingRouteWithId(RouteEnum.PAINS, athleteId)} value={TabsEnum.PAINS}>
            Histórico de Dores
          </TabsTrigger>
          <TabsTrigger href={buildingRouteWithId(RouteEnum.INJURIES, athleteId)} value={TabsEnum.INJURIES}>
            Histórico de Lesões
          </TabsTrigger>
        </TabsList>
      )}
      {children}
    </Tabs>
  )
}
