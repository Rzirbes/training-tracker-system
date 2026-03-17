'use client'

import Link from 'next/link'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { useAuthContext, useDialogContext } from '@/contexts'
import revalidateAction from '@/lib/revalidate-action'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ConfirmDeleteDialog } from '@/components/compositions'
import { buildingRouteWithId } from '@/lib/utils'
import { RouteEnum } from '@/enums'

interface Props {
  athleteId: string
  painId: string
  tag: string
}

export function PainListOptions({ athleteId, painId, tag }: Props) {
  const { dialog } = useDialogContext()
  const { isAdmin } = useAuthContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!isAdmin}>
        <button
          disabled={!isAdmin}
          className='py-1 px-1 rounded-md text-foreground bg-background dark:text-background dark:bg-background-foreground hover:brightness-95 dark:hover:brightness-150 transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <EllipsisVertical />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit'>
        <DropdownMenuItem asChild>
          <Link href={buildingRouteWithId(RouteEnum.UPDATE_PAIN, athleteId, painId)}>
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
                <ConfirmDeleteDialog
                  title='Você tem certeza que deseja excluir essa dor?'
                  route={'pains/'.concat(painId)}
                  onClose={dialog?.current.close}
                  onSuccess={() => {
                    revalidateAction(tag)
                  }}
                />
              )
            }}
          >
            <Trash className='stroke-2 size-4' size={20} />
            Excluir
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
