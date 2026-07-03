import ky from 'ky'

import { useAuthStore } from '@/stores/auth'

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// Prod: full backend URL from VITE_API_URL. Dev: '/api' handled by the Vite proxy.
const API_URL: string = import.meta.env.VITE_API_URL ?? '/api'

export const api = ky.create({
  prefix: API_URL,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const { accessToken } = useAuthStore.getState()
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`)
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== 401 || request.url.includes('/auth/refresh')) return

        const { refreshToken } = useAuthStore.getState()
        if (!refreshToken) throw new Error('Unauthorized')

        try {
          const refreshed = await ky
            .post(`${API_URL}/auth/refresh`, {
              json: { refresh_token: refreshToken },
            })
            .json<TokenResponse>()

          useAuthStore.getState().setTokens(refreshed.access_token, refreshed.refresh_token)

          request.headers.set('Authorization', `Bearer ${refreshed.access_token}`)
          return ky(request)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
          throw new Error('Session expired')
        }
      },
    ],
  },
})
