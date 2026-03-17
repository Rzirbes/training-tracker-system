import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Footer,
  Logo,
  Sidebar,
  ThemeButton,
} from '@/components/ui'
import { AuthTemplate } from '@/components/templates'
import { RouteEnum, UserRoleEnum } from '@/enums'
import { verifySession } from '@/server'
import { AuthContextProvider } from '@/contexts'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession()
  const userName = getUserName()
  const isAdmin = session.user?.type === UserRoleEnum.ADMIN

  function getUserName() {
    const name = session.user?.name ?? ''
    const [first, last = ''] = name.split(' ')
    const fallback = last.length ? first[0]?.concat(last[0]) : first[0]
    return { name, fallback }
  }

  return (
    <div className='w-full min-h-screen relative'>
      <header className='px-5 lg:px-9 py-4 flex justify-between items-center border-b border-[#DEDFE3] fixed w-full bg-background z-20'>
        <Logo href={RouteEnum.AUTHENTICATED} />
        <span className='inline xl:hidden'>
          <Sidebar isMobile isAdmin={isAdmin} />
        </span>
        <span className='hidden xl:inline'>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='rounded-[6px] flex items-center gap-2 p-0.5 px-3'>
              <p>{userName.name}</p>
              <Avatar>
                <AvatarFallback>{userName.fallback}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-2'>
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
              <DropdownMenuItem disabled>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <ThemeButton />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <AuthTemplate.LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </header>
      <div className='w-full h-full min-h-screen flex relative z-10'>
        {isAdmin && <Sidebar isAdmin={isAdmin} />}
        <AuthContextProvider context={{ isAdmin, user: session.user }}>
          <div className='w-full h-full mt-20'>{children}</div>
        </AuthContextProvider>
      </div>
      <Footer />
    </div>
  )
}
