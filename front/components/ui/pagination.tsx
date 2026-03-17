'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { usePathname, useSearchParams } from 'next/navigation'

const Root = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Root.displayName = 'PaginationRoot'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  href: string
  isActive?: boolean
  isDisabled?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size = 'icon', isDisabled = false, ...props }: PaginationLinkProps) => {
  return (
    <Link href={props.href} legacyBehavior>
      <a
        {...(isActive && { 'aria-current': 'page' })}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          className,
          isDisabled && 'pointer-events-none text-gray-400'
        )}
        {...props}
      />
    </Link>
  )
}
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label='Go to previous page'
    size='default'
    className={cn('gap-1 pl-2.5 group', className)}
    {...props}
  >
    <ChevronLeft className='h-4 w-4' />
    <span>Voltar</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to next page' size='default' className={cn('gap-1 pr-2.5', className)} {...props}>
    <span>Próxima</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

interface Props extends Omit<React.ComponentProps<'nav'>, 'children'> {
  page: number
  lastPage: number
  total: number
  size?: number
}

const siblingsCount = 1

const Pagination = ({ page: currentPage, lastPage, total, size, ...props }: Props) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const previousPage = currentPage - 1
  const previousPages = currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : []

  const nextPage = currentPage + 1
  const nextPages =
    currentPage < lastPage ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage)) : []

  const disableNextButton = currentPage >= lastPage
  const disablePreviousButton = currentPage <= 1

  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const createPageUrl = React.useCallback(
    (page: number) => pathname.concat('?').concat(createQueryString('page', page.toString())),
    [pathname, createQueryString]
  )

  return (
    <Root {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(previousPage)}
            isDisabled={disablePreviousButton}
            tabIndex={disablePreviousButton ? -1 : 0}
          />
        </PaginationItem>
        {currentPage > 1 + siblingsCount && (
          <>
            <PaginationItem>
              <PaginationLink href={createPageUrl(1)} isActive={currentPage === 1}>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {previousPages.length > 0 &&
          previousPages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={createPageUrl(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}
        <PaginationItem>
          <PaginationLink href={createPageUrl(currentPage)} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        {nextPages.length > 0 &&
          nextPages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={createPageUrl(page)}>{page}</PaginationLink>
            </PaginationItem>
          ))}
        {currentPage + siblingsCount < lastPage && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={createPageUrl(lastPage)}>{lastPage}</PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            href={createPageUrl(nextPage)}
            isDisabled={disableNextButton}
            tabIndex={disableNextButton ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Root>
  )
}
Pagination.displayName = 'Pagination'

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)].map((_, index) => from + index + 1).filter((page) => page > 0)
}

export { Pagination }
