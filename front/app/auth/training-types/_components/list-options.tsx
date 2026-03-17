'use client'

import { EllipsisVertical, Flag, Pencil, SquareCheck, SquareX } from 'lucide-react'
import { useDialogContext, useDrawerContext } from '@/contexts'
import { serverFetcher } from '@/services'
import revalidateAction from '@/lib/revalidate-action'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui'
import { ConfirmDialog, ConfirmStatusDialog } from '@/components/compositions'
import { TrainingTypeForm } from './form'

export function TrainingTypeListOptions({ isEnabled, id }: { id: string; isEnabled: boolean }) {
  const { dialog } = useDialogContext()
  const { drawer } = useDrawerContext()

  async function openEdit() {
    const response = await serverFetcher('training-types/'.concat(id))
    if (response.ok)
      drawer.current?.open(<TrainingTypeForm closeDrawer={drawer.current?.close} defaultValues={response.data} />)
  }

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
          <button className='w-full text-left flex gap-2 items-center cursor-pointer' onClick={openEdit}>
            <Pencil className='stroke-2 size-4' />
            Editar
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            className='w-full text-left flex gap-2 items-center cursor-pointer'
            onClick={() => {
              dialog.current?.open(
                <ConfirmStatusDialog
                  title={`Você tem certeza que deseja ${statusLabel.toLowerCase()} esse tipo de treino?`}
                  route={`training-types/${id}/update-status`}
                  onSuccess={() => revalidateAction('training-types')}
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
        <DropdownMenuItem asChild>
          <button
            className='w-full text-left flex gap-2 items-center cursor-pointer'
            onClick={() => {
              dialog.current?.open(
                <ConfirmDialog
                  title={`Você tem certeza que deseja definir esse tipo de treino como Padrão?`}
                  description=' Ao confirmar todo novo agendamento iniciará com esse tipo de treino selecionado. Você poderá alterar o tipo de treino padrão a qualquer momento.'
                  route={`training-types/default`}
                  onSuccess={() => revalidateAction('training-types')}
                  onClose={dialog.current.close}
                  method='POST'
                  body={JSON.stringify({ trainingTypeId: id })}
                />
              )
            }}
          >
            <Flag className='stroke-2 size-4' />
            Definir como padrão
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
