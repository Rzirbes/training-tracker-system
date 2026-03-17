'use server'

import { redirect } from 'next/navigation'
import { createAccessCookie, refreshAccessToken, verifySession } from '@/server'
import { RouteEnum } from '@/enums'

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

let refreshTokenController: AbortController | null = null

export async function serverFetcher<T = any>(url: string, props?: (RequestInit & { auth?: boolean }) | undefined) {
  const auth = props?.auth ?? true

  if (!auth) {
    const response = await fetcher(url, props)
    return { ok: response.ok, data: (await response.json()) as T, status: response.status }
  }

  const session = await verifySession()

  if (!session.access) return redirect(RouteEnum.LOGIN)

  const response = await fetcher(url, props, session.access)
  return handleResponse<T>(response, url, props, session)
}

async function handleResponse<T>(response: Response, url: string, props?: RequestInit, session?: any) {
  if (response.status === 401 && session) {
    if (!session.user?.keepAuth || !session.refresh) return redirect(RouteEnum.LOGIN)

    if (refreshTokenController) {
      await new Promise((resolve) => {
        refreshTokenController!.signal.addEventListener('abort', resolve)
      })
    } else {
      refreshTokenController = new AbortController()
      const refreshedToken = await refreshAccessToken(session.refresh, refreshTokenController)

      if (refreshedToken) {
        createAccessCookie(refreshedToken)
        refreshTokenController.abort()
        refreshTokenController = null
        const tryResponse = await fetcher(url, props, refreshedToken)
        return { ok: tryResponse.ok, data: (await tryResponse.json()) as T, status: tryResponse.status }
      } else {
        refreshTokenController.abort()
        refreshTokenController = null
        return redirect(RouteEnum.LOGIN)
      }
    }
  }
  return { ok: response.ok, data: (await response?.json()) as T, status: response.status }
}

async function fetcher(url: string, props?: RequestInit, token?: string): Promise<Response> {
  const isFormData = props?.body instanceof FormData

  const headers = {
    ...props?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
  }

  return fetch(baseUrl.concat(url), {
    ...props,
    headers,
  })
}
