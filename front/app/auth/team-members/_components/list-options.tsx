'use client'

import Link from 'next/link'
import { EllipsisVertical, Pencil, SquareCheck, SquareX } from 'lucide-react'
import { useDialogContext } from '@/contexts'
import revalidateAction from '@/lib/revalidate-action'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ConfirmStatusDialog } from '@/components/compositions'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'

export function CoachListOptions({ isEnabled, id }: { id: string; isEnabled: boolean }) {
  const { dialog } = useDialogContext()

  const statusLabel = isEnabled ? 'Inativar' : 'Ativar'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='py-1 px-1 text-foreground bg-background dark:text-background dark:bg-background-foreground rounded-md'>
          <EllipsisVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit'>
        <DropdownMenuItem asChild>
          <Link href={buildingRouteWithId(RouteEnum.UPDATE_TEAM_MEMBERS, id)}>
            <button className='w-full text-left flex gap-2 items-center cursor-pointer'>
              <Pencil className='stroke-2 size-4' />
              Editar
            </button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className='w-full text-left flex gap-2 items-center cursor-pointer'
            onClick={() => {
              dialog.current?.open(
                <ConfirmStatusDialog
                  title={`Você tem certeza que deseja ${statusLabel.toLowerCase()} esse colaborador?`}
                  route={`coaches/${id}/update-status`}
                  onSuccess={() => revalidateAction('coaches')}
                  onClose={dialog.current.close}
                  currentStatus={isEnabled}
                />
              )
            }}
          >
            {isEnabled ? <SquareX className='stroke-2 size-4' /> : <SquareCheck className='stroke-2 size-4' />}
            {statusLabel}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
