'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

interface Props {
  href: string[]
  label: string
  icon: React.ReactNode
}

export function MenuButton({ href, label, icon }: Props) {
  const pathname = usePathname()
  const { id = '', child_id = '' } = useParams()
  const isActive = href
    .map((route) => route.replace(':ID', id as string).replace(':CHILD_ID', child_id as string))
    .includes(pathname)
  
  const styles = {
    base: 'text-foreground hover:text-background hover:bg-foreground flex items-center gap-2 py-2 px-4 rounded-md w-full text-lg md:text-base transition-colors',
    active: 'bg-primary text-primary-foreground font-semibold',
  }

  return (
    <Link href={href[0]} className='rounded-md' prefetch={true}>
      <li className={twMerge(styles.base, isActive && styles.active)}>
        {icon}
        {label}
      </li>
    </Link>
  )
}
