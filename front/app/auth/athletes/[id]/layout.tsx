import { headers } from 'next/headers'
import { AthleteTemplate } from '@/components/templates'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const heads = headers()
  const pathname = heads.get('x-pathname') ?? ''
  const id = pathname.split('/')[3]

  return <AthleteTemplate.Detail id={id}>{children}</AthleteTemplate.Detail>
}
