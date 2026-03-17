import { UserRoleEnum } from '@/enums'
import { clientFetcher } from '../client-fetcher'

class API {
  private headers = { 'Content-Type': 'application/json' }
  private baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

  public users = {
    coach: {
      create: async (data: {
        name: string
        email: string
      }): Promise<{ ok: boolean; title: string; message: string; conflict?: boolean }> => {
        try {
          const res = await fetch(this.baseUrl.concat('users/coach'), {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(data),
            cache: 'no-cache',
          })
          const response = await res.json()
          return { ok: res.ok, title: response.title, message: response.message, conflict: res.status === 409 }
        } catch {
          return {
            ok: false,
            title: 'Desculpe, parece que ocorreu um erro.',
            message: 'Tente novamente em instantes...',
          }
        }
      },
    },
  }

  public auth = {
    createPassword: async (data: {
      password: string
      confirmPassword: string
      token: string
    }): Promise<{ ok: boolean; title: string; message: string; conflict?: boolean }> => {
      try {
        const res = await clientFetcher('auth/create-password', {
          method: 'POST',
          body: JSON.stringify(data),
          cache: 'no-cache',
        })
        const response = await res.data
        return { ok: res.ok, title: response.title, message: response.message }
      } catch {
        return {
          ok: false,
          title: 'Desculpe, parece que ocorreu um erro.',
          message: 'Tente novamente em instantes...',
        }
      }
    },
    login: async (data: {
      email: string
      password: string
    }): Promise<
      | {
          ok: true
          data: {
            token: string
            refreshToken: string
            user: {
              name: string
              uuid: string
              type: UserRoleEnum
            }
          }
        }
      | {
          ok: false
          data: { title: string; message: string }
        }
    > => {
      try {
        const res = await clientFetcher('auth/login', {
          method: 'POST',
          body: JSON.stringify(data),
          cache: 'no-cache',
        })
        return { ok: res.ok, data: res.data }
      } catch {
        return {
          ok: false,
          data: {
            title: 'Desculpe, parece que ocorreu um erro.',
            message: 'Tente novamente em instantes...',
          },
        }
      }
    },
    forgotPassword: async (data: {
      email: string
    }): Promise<{ ok: boolean; title: string; message: string; conflict?: boolean }> => {
      try {
        const res = await clientFetcher('auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify(data),
          cache: 'no-cache',
        })
        const response = await res.data
        return { ok: res.ok, title: response.title, message: response.message }
      } catch {
        return {
          ok: false,
          title: 'Desculpe, parece que ocorreu um erro.',
          message: 'Tente novamente em instantes...',
        }
      }
    },
  }

  public getBaseUrl() {
    return this.baseUrl
  }
}

export const services = new API()
