'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from './input'
import { Button } from './button'
import { Search } from 'lucide-react'

export function SearchInput({ value, placeholder }: { value: string; placeholder: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(value)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('page', '1')

      if (value) params.set(name, value)
      else params.delete(name)

      return params.toString()
    },
    [searchParams]
  )

  const handleSearch = useCallback(
    (value: string) => router.push(pathname.concat('?').concat(createQueryString('search', value))),
    [pathname, createQueryString]
  )

  useEffect(() => {
    if (!search) handleSearch('')
  }, [search])

  return (
    <div className='flex w-full'>
      <Input
        type='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className='md:max-w-xs rounded-tr-none rounded-br-none focus-visible:ring-transparent'
        onKeyDown={(e) => e.code === 'Enter' && handleSearch(search)}
      />
      <Button className='rounded-tl-none rounded-bl-none' onClick={() => handleSearch(search)}>
        <Search size={20} />
      </Button>
    </div>
  )
}
