'use client'

import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react'
import { Dialog, type DialogProps as RootProps } from '../../ui'

export interface DialogProps {
  open(children: React.ReactNode): void
  close(): void
}

export const DialogComposition = forwardRef<DialogProps, any>(Root)

function Root(props: RootProps, ref: React.ForwardedRef<DialogProps>) {
  const { isOpen, children, handleImperative, toggle } = useModal()

  useImperativeHandle(ref, handleImperative)

  return (
    <Dialog open={isOpen} onOpenChange={toggle} {...props}>
      {children}
    </Dialog>
  )
}

function useModal(onClose?: () => void) {
  const [children, setChildren] = useState<ReactNode | null>(null)

  const isOpen = !!children

  function close() {
    setChildren(null)
    if (typeof onClose === 'function') onClose()
  }

  function toggle(open: boolean) {
    if (!open) setChildren(null)
  }

  function handleImperative() {
    return {
      open: setChildren,
      close,
    }
  }

  return {
    isOpen,
    children,
    close,
    handleImperative,
    toggle,
  }
}
