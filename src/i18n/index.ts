import { createI18n } from 'vue-i18n'

import en from './locales/en'
import my from './locales/my'

export type AppLocale = 'en' | 'my'

export const SUPPORTED_LOCALES: AppLocale[] = ['en', 'my']

const STORAGE_KEY = 'dhammawave.locale'

function detectLocale(): AppLocale {
  const fromQuery = new URLSearchParams(window.location.search).get('lang')

  if (fromQuery === 'en' || fromQuery === 'my') {
    return fromQuery
  }

  const stored = localStorage.getItem(STORAGE_KEY)

  if (stored === 'en' || stored === 'my') {
    return stored
  }

  return navigator.language.toLowerCase().startsWith('my') ? 'my' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    my,
  },
})

export function setLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', locale)
}

setLocale(i18n.global.locale.value)
