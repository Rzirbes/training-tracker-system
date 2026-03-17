'use server'

import { cookies } from 'next/headers'
import { CookiesEnum, RouteEnum, UserRoleEnum } from '@/enums'
import { redirect } from 'next/navigation'

interface SessionPayload {
  access: string
  refresh: string
  user: UserProps
}

interface UserProps {
  uuid: string
  name: string
  type: UserRoleEnum
  keepAuth: boolean
}

async function createCookie(name: string, value: string, expires: Date, httpOnly = true) {
  cookies().set(name, value, {
    name,
    httpOnly,
    expires,
    secure: true,
    path: '/',
  })
}

export async function createAccessCookie(token: string) {
  createCookie(CookiesEnum.SESSION, token, new Date(Date.now() + 5 * 60 * 1000), false) // FIXME: Remover o 'false' do parâmetro httpOnly quando não utilizar mais requisições pelo lado do cliente.
}

export async function createSession(session: SessionPayload, keepSession = false) {
  const expiresAt = {
    access: new Date(Date.now() + 5 * 60 * 1000),
    refresh: new Date(Date.now() + (keepSession ? 1 : 8) * 60 * 60 * 1000), // 1h || 8h
  }

  createAccessCookie(session.access)
  createCookie(CookiesEnum.REFRESH, session.refresh, expiresAt.refresh)
  createCookie(CookiesEnum.USER, JSON.stringify(session.user), expiresAt.refresh)
}

export async function verifySession() {
  const session = {
    access: cookies().get(CookiesEnum.SESSION)?.value,
    refresh: cookies().get(CookiesEnum.REFRESH)?.value,
    user: cookies().get(CookiesEnum.USER)?.value,
  }

  return {
    ...session,
    user: session.user ? (JSON.parse(session.user) as UserProps) : null,
  }
}

export async function deleteSession() {
  cookies().delete(CookiesEnum.SESSION)
  cookies().delete(CookiesEnum.REFRESH)
  cookies().delete(CookiesEnum.USER)
  cookies().delete(CookiesEnum.SCHEDULE)
  redirect(RouteEnum.LOGIN)
}
