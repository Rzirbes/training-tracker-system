'use client'

import { createContext, useContext, useRef, type ReactNode, type RefObject } from 'react'
import { DrawerComposition, type DrawerProps } from '@/components/compositions'

interface DrawerContextProps {
  drawer: RefObject<DrawerProps>
}

const DrawerContext = createContext({} as DrawerContextProps)

export function useDrawerContext() {
  const context = useContext(DrawerContext)
  return context
}

export function DrawerContextRoot({ children }: { children: ReactNode }) {
  const drawer = useRef<DrawerProps>(null)
  return (
    <DrawerContext.Provider value={{ drawer }}>
      {children}
      <DrawerComposition ref={drawer} />
    </DrawerContext.Provider>
  )
}
