'use client'

import { createContext, useContext, type ReactNode } from "react";
import { UserRoleEnum } from "@/enums";

interface AuthContextProps {
  isAdmin: boolean;
  user: {
    uuid: string
    name: string
    type: UserRoleEnum
    keepAuth: boolean
  } | null
}

const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ context, children }: { context: AuthContextProps; children: ReactNode }) {
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  return context
}