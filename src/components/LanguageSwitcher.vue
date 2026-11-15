<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { SUPPORTED_LOCALES, setLocale, type AppLocale } from '@/i18n'

const { locale } = useI18n()

const current = computed<AppLocale>(() => (locale.value as AppLocale) ?? 'en')

function select(event: Event): void {
  const value = (event.target as HTMLSelectElement).value as AppLocale
  setLocale(value)
}
</script>

<template>
  <label class="relative inline-flex items-center">
    <span class="sr-only">{{ $t('languageLabel') }}</span>
    <select
      :value="current"
      class="focus-ring cursor-pointer appearance-none rounded-full border border-outline bg-surface py-1.5 ps-3 pe-7 text-sm font-semibold text-ink transition hover:border-primary"
      @change="select"
    >
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
        {{ code === 'my' ? $t('languageBurmese') : $t('languageEnglish') }}
      </option>
    </select>
    <svg
      class="pointer-events-none absolute end-2 size-3.5 text-muted"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clip-rule="evenodd"
      />
    </svg>
  </label>
</template>
