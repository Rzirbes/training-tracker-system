'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { useDrawerContext } from '@/contexts'
import { TrainingTypeForm } from './_components'

export function Create() {
  const { drawer } = useDrawerContext()

  return (
    <Button
      className='px-10 w-full md:w-fit'
      onClick={() => {
        drawer.current?.open(<TrainingTypeForm closeDrawer={drawer.current?.close} />)
      }}
    >
      <Plus />
      Cadastrar Tipo de Treino
    </Button>
  )
}
