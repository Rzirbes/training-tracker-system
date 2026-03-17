'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { buttonVariants, Logo } from '../ui'
import { PublicImages } from '@/enums'

const ThemeButton = dynamic(
  async () => {
    const data = await import('../ui/theme-button')
    return data.ThemeButton
  },
  { ssr: false }
)

export function BaseTemplate({ children }: { children: ReactNode }) {
  return (
    <main className='grid grid-cols-1 lg:grid-cols-[25%_75%] lg:items-center min-h-screen max-w-screen w-full h-full pb-10 lg:pb-0 '>
      <div className='w-full h-fit lg:min-h-screen lg:h-full bg-primary flex justify-center lg:justify-start lg:items-end p-6 lg:p-10'>
        <Logo src={PublicImages.LOGO_DARK} />
      </div>
      {children}
      <div className='absolute right-4 top-6 xl:right-4 xl:top-4'>
        <ThemeButton className={buttonVariants({ variant: 'outline' })} onlyIcon />
      </div>
    </main>
  )
}
