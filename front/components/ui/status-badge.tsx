import { SquareCheck, SquareX } from 'lucide-react'

export function StatusBadge({ isEnabled }: { isEnabled: boolean }) {
  const status = isEnabled ? 'Ativo' : 'Inativo'
  return (
    <span className='flex gap-2 justify-center sm:justify-normal items-center min-w-full md:min-w-24' title={status}>
      {isEnabled ? <SquareCheck className='stroke-2 size-4' /> : <SquareX className='stroke-2 size-4' />}
      <span className='hidden sm:inline'>{status}</span>
    </span>
  )
}
