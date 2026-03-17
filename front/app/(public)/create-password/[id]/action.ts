import { serverFetcher } from "@/services";

export const createPasswordAction = async (data: {
    password: string
    confirmPassword: string
    token: string
}): Promise<{ ok: boolean; title: string; message: string; conflict?: boolean }> => {
    try {
        const res = await serverFetcher('auth/create-password', {
          method: 'POST',
          body: JSON.stringify(data),
          cache: 'no-cache',
          auth: false,
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
}