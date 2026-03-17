'use client'

import { createContext, useContext, type ReactNode } from "react";
import type { AthleteProps } from "@/types";

interface AthleteContext {
  athlete: AthleteProps
  mutate(props?: AthleteProps): void
  isLoading: boolean
}

const AthleteContext = createContext({} as AthleteContext)

export function AthleteContextProvider({ context, children }: { context: AthleteContext; children: ReactNode }) {
  return <AthleteContext.Provider value={context}>{children}</AthleteContext.Provider>
}

export function useAthleteContext() {
  const context = useContext(AthleteContext)
  return context
}