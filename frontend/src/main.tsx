import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/query-client'
import { resolveTheme, type ThemeMode } from '@/stores/theme'
import '@/lib/i18n'
import './index.css'
import { App } from './app'

// Apply theme before React renders to avoid FOUC
;(() => {
  try {
    const stored = window.localStorage.getItem('theme-storage')
    const mode: ThemeMode = stored
      ? ((JSON.parse(stored).state?.mode as ThemeMode) ?? 'system')
      : 'system'
    const theme = resolveTheme(mode)
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  } catch {
    // localStorage unavailable — default light
  }
})()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  </StrictMode>,
)
