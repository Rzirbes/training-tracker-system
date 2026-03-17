import type { DetailedHTMLProps, DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Details = Object.assign(
  {},
  {
    Root,
    Summary,
    Header,
    Body,
  }
)

function Root({
  className,
  ...props
}: DetailedHTMLProps<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>) {
  return (
    <details
      className={cn(
        'w-full rounded-xl border bg-background [&[open]>summary_svg]:rotate-180 transition-all',
        className
      )}
      {...props}
    />
  )
}

function Summary({ children, className, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <summary
      className={cn('cursor-pointer list-none p-4 flex items-center justify-between gap-4 rounded-xl mb-1', className)}
      {...props}
    >
      {children}
      <ChevronDown className='size-5 transition-transform duration-300' />
    </summary>
  )
}

function Header({ title, description }: { title?: string; description?: string }) {
  return (
    <div>
      <h1 className='text-xl md:text-lg font-semibold'>{title}</h1>
      {description && <p className='text-lg md:text-base'>{description}</p>}
    </div>
  )
}

function Body({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2.5 p-4', className)} {...props} />
}
