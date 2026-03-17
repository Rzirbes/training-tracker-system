import { BaseTemplate } from '@/components/templates'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return <BaseTemplate>{children}</BaseTemplate>
}
