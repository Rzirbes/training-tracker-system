'use client'
import { forwardRef, useImperativeHandle, useState, type ReactNode } from 'react'
import { Drawer, type DrawerProps as RootProps } from '../../ui'

export interface DrawerProps {
  open(children: React.ReactNode): void
  close(): void
}

export const DrawerComposition = forwardRef<DrawerProps, any>(Root)

function Root(props: RootProps, ref: React.ForwardedRef<DrawerProps>) {
  const { isOpen, children, handleImperative, toggle } = useDrawer()

  useImperativeHandle(ref, handleImperative)

  if (!isOpen) return null

  return (
    <Drawer open={isOpen} onOpenChange={toggle} {...props}>
      {children}
    </Drawer>
  )
}

function useDrawer(onClose?: () => void) {
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
