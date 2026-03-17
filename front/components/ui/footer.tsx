import { PublicImages } from '@/enums'
import { Logo } from './logo'

export function Footer() {
  return (
    <footer className='w-full bg-primary brightness-95 h-full py-12 px-8 flex gap-2 items-center justify-center print:hidden'>
      <Logo src={PublicImages.LOGO_DARK} />
      <p className='font-semibold text-center w-fit text-background py-2 border-l-2 border-primary-dark px-4'>
        Copyright @ 2024
      </p>
    </footer>
  )
}
