import ky from 'ky'

const AUTH_STORAGE_KEY = 'auth-storage'

interface AuthState {
  accessToken?: string
  refreshToken?: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

function readAuthState(): AuthState | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!stored) return null
  try {
    return (JSON.parse(stored).state as AuthState) ?? null
  } catch {
    return null
  }
}

function writeAuthState(state: AuthState): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ state, version: 0 }))
}

export const api = ky.create({
  prefix: '/api',
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const state = readAuthState()
        if (state?.accessToken) {
          request.headers.set('Authorization', `Bearer ${state.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== 401 || request.url.includes('/auth/refresh')) return

        const state = readAuthState()
        if (!state?.refreshToken) throw new Error('Unauthorized')

        try {
          const refreshed = await ky
            .post('/api/auth/refresh', {
              json: { refresh_token: state.refreshToken },
            })
            .json<TokenResponse>()

          writeAuthState({
            ...state,
            accessToken: refreshed.access_token,
            refreshToken: refreshed.refresh_token,
          })

          request.headers.set('Authorization', `Bearer ${refreshed.access_token}`)
          return ky(request)
        } catch {
          localStorage.removeItem(AUTH_STORAGE_KEY)
          window.location.href = '/login'
          throw new Error('Session expired')
        }
      },
    ],
  },
})
