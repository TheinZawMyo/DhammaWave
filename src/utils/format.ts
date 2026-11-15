/**
 * Format helpers shared across the site.
 */

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '0:00'
  }

  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export function formatDate(iso: string | null): string {
  if (!iso) return ''

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(i18nLocale(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function i18nLocale(): string {
  return document.documentElement.getAttribute('lang') === 'my' ? 'my-MM' : 'en-GB'
}

/**
 * Human readable duration used in card metadata (e.g. "12 min" / "1 hr 5 min").
 */
export function durationLabel(seconds: number, translate: (key: string, named: Record<string, unknown>) => string): string {
  const total = Math.max(0, Math.round(seconds / 60))
  const hours = Math.floor(total / 60)
  const minutes = total % 60

  if (hours > 0) {
    return translate('durationHoursMinutes', { hours, minutes })
  }

  return translate('durationMinutes', { minutes })
}
