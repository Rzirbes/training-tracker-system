'use client'

import { DropdownMenuItem } from '@/components/ui'
import { LogOut } from 'lucide-react'
import { useServerAction } from '@/lib'
import { signOutAction } from '@/server'

export function LogoutButton() {
  const { execute } = useServerAction(signOutAction)

  return (
    <DropdownMenuItem className='flex gap-1 cursor-pointer' onClick={() => execute()}>
      <LogOut size={20} />
      Sair
    </DropdownMenuItem>
  )
}
