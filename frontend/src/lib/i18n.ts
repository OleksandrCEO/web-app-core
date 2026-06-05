import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en/translation.json'
import uk from '@/locales/uk/translation.json'

const SUPPORTED_LANGUAGES = ['en', 'uk'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const STORAGE_KEY = 'app.language'

function detectInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage
  }

  const browserLang = window.navigator.language?.split('-')[0]
  if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage
  }

  return 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
  interpolation: {
    escapeValue: false,
  },
})

export function setLanguage(lang: SupportedLanguage): void {
  i18n.changeLanguage(lang)
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // localStorage unavailable — silently ignore
  }
  document.documentElement.lang = lang
}

if (typeof window !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export default i18n
