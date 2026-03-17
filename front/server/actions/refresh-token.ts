'use server'

import { services } from '@/services'

export async function refreshAccessToken(refreshToken: string, controller?: AbortController) {
  try {
    const response = await fetch(services.getBaseUrl().concat('auth/refresh-token'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
      signal: controller?.signal,
    })
    return response.ok ? ((await response.json()) as { token: string }).token : null
  } catch {
    return null
  }
}
