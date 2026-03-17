'use client'

import { Bolt, BookUser, Home, LogOut, Menu, Users } from 'lucide-react'
import { MenuButton } from './menu'
import { Button } from '../button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../sheet'
import { RouteEnum } from '@/enums'
import { signOutAction } from '@/server'
import { ThemeButton } from '../theme-button'

const menus = [
  { href: [RouteEnum.AUTHENTICATED], label: 'Inicio', icon: <Home /> },
  {
    href: [
      RouteEnum.ATHLETES,
      RouteEnum.CREATE_ATHLETE,
      RouteEnum.UPDATE_ATHLETE,
      RouteEnum.MONITORY,
      RouteEnum.DETAIL_ATHLETE,
      RouteEnum.TRAININGS,
      RouteEnum.CREATE_TRAINING,
      RouteEnum.UPDATE_TRAINING,
      RouteEnum.TRAINING_PLANNING,
      RouteEnum.CREATE_TRAINING_PLANNING,
      RouteEnum.UPDATE_TRAINING_PLANNING,
      RouteEnum.INJURIES,
      RouteEnum.CREATE_INJURY,
      RouteEnum.UPDATE_INJURY,
      RouteEnum.PAINS,
      RouteEnum.CREATE_PAIN,
      RouteEnum.UPDATE_PAIN,
    ],
    label: 'Atletas',
    icon: <Users />,
  },
  {
    href: [RouteEnum.TEAM_MEMBERS, RouteEnum.CREATE_TEAM_MEMBERS, RouteEnum.UPDATE_TEAM_MEMBERS],
    label: 'Colaboradores',
    icon: <BookUser />,
  },
  { href: [RouteEnum.TRAINING_TYPES], label: 'Tipos de Treino', icon: <Bolt /> },
]

interface Props {
  isMobile?: boolean
  isAdmin?: boolean
}

export function Sidebar({ isMobile = false, isAdmin = false }: Props) {
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger>
          <Menu />
          <span className='sr-only'>Abrir menu</span>
        </SheetTrigger>
        <SheetContent side='right' className='w-fit flex flex-col gap-4'>
          <SheetHeader className='sr-only'>
            <SheetTitle>Menu aberto</SheetTitle>
            <SheetDescription>Utilize para navegar entre as páginas</SheetDescription>
          </SheetHeader>
          <div className='flex flex-col min-w-40 justify-between h-full relative'>
            {isAdmin && (
              <menu className='flex flex-col gap-2 w-full'>
                {menus.map((props) => (
                  <SheetClose asChild key={props.label}>
                    <MenuButton {...props} />
                  </SheetClose>
                ))}
              </menu>
            )}
            <Button variant='outline' className='w-full flex min-w-32 absolute bottom-16'>
              <ThemeButton className='flex items-center justify-center gap-2' />
            </Button>
            <Button variant='outline' className='w-full min-w-32 absolute bottom-0' onClick={() => signOutAction()}>
              <LogOut size={20} /> <span className=' font-semibold'>Sair</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <div className='hidden xl:inline pt-5 pb-8 px-8 border-r print:hidden relative min-w-60 mt-20'>
      <menu className='flex flex-col gap-2 fixed '>
        {menus.map((props) => (
          <MenuButton key={props.label} {...props} />
        ))}
      </menu>
    </div>
  )
}
