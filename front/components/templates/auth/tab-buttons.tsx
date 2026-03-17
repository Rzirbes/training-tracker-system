'use client'

import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { RouteEnum } from '@/enums'

interface Props {
  children: React.ReactNode
}

export function TabComponent({ children }: Props) {
  const route = usePathname().split('/')[1]

  const defaultTabByRoute = {
    login: RouteEnum.LOGIN,
    register: RouteEnum.REGISTER,
    ['create-password']: RouteEnum.REGISTER,
  } as Record<string, RouteEnum>

  return (
    <div className='w-full h-screen flex flex-col p-6 md:p-10 justify-between items-center '>
      <Tabs
        defaultValue={defaultTabByRoute[route] ?? defaultTabByRoute.register}
        className='w-full flex flex-col gap-20 focus-visible:border-0'
      >
        <TabsList className='mx-auto flex-nowrap'>
          <TabsTrigger value={RouteEnum.REGISTER}>Criar Conta</TabsTrigger>
          <TabsTrigger value={RouteEnum.LOGIN}>Entrar</TabsTrigger>
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
