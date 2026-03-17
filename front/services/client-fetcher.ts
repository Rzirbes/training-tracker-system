'use client'

import { redirect } from 'next/navigation'
import { getCookie, setCookie } from 'cookies-next'
import { CookiesEnum, RouteEnum } from '@/enums'

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

let refreshTokenController: AbortController | null = null

export async function clientFetcher<T = any>(url: string, props?: RequestInit | undefined) {
  const session = getCookie(CookiesEnum.SESSION)
  const refresh = getCookie(CookiesEnum.REFRESH)
  const user = getCookie(CookiesEnum.USER)

  const response = await fetcher(url, props, session)

  if (response.status === 401) {
    if (!user || !refresh) return redirect(RouteEnum.LOGIN)

    if (refreshTokenController) {
      await new Promise((resolve) => {
        refreshTokenController!.signal.addEventListener('abort', resolve)
      })
    } else {
      refreshTokenController = new AbortController()
      const refreshedToken = await generateRefreshTokens(refresh, refreshTokenController)

      if (refreshedToken) {
        setCookie(CookiesEnum.SESSION, refreshedToken)
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

  return { ok: response.ok, data: (await response.json()) as T, status: response.status }
}

async function fetcher(url: string, props?: RequestInit, token?: string): Promise<Response> {
  return await fetch(baseUrl.concat(url), {
    ...props,
    headers: {
      ...props?.headers,
      ...(token && { Authorization: 'Bearer '.concat(token) }),
      ...((props?.method === 'POST' || props?.method === 'PUT') && { 'Content-Type': 'application/json' }),
    },
  })
}

async function generateRefreshTokens(refreshToken: string, controller: AbortController): Promise<string | null> {
  const response = await fetch(baseUrl.concat('auth/refresh-token'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    signal: controller.signal,
  })
  return response.ok ? ((await response.json()) as { token: string }).token : null
}