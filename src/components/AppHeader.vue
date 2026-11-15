<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const open = ref(false)

const links = [
  { name: 'home', label: 'navHome' },
  { name: 'browse', label: 'navBrowse' },
  { name: 'teachers', label: 'navTeachers' },
  { name: 'download', label: 'navDownload' },
  { name: 'privacy', label: 'navPrivacy' },
] as const
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-outline/70 bg-background/90 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <RouterLink to="/" class="focus-ring flex items-center gap-2.5 rounded-lg">
        <span
          class="grid size-9 place-items-center rounded-xl bg-primary text-lg text-white shadow-sm"
          aria-hidden="true"
        >
          ☸
        </span>
        <span class="flex flex-col leading-tight">
          <span class="text-lg font-bold tracking-tight text-primary">DhammaWave</span>
          <span class="hidden text-[11px] font-medium text-muted sm:block">{{ $t('appTagline') }}</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="focus-ring rounded-full px-3.5 py-2 text-sm font-semibold text-ink/80 transition hover:bg-surface-variant hover:text-primary"
          active-class="!bg-primary-container !text-on-primary-container"
        >
          {{ $t(link.label) }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <div class="hidden sm:block">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          class="focus-ring grid size-10 place-items-center rounded-xl border border-outline bg-surface text-ink transition hover:border-primary md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="$t('navMenu')"
          @click="open = !open"
        >
          <svg v-if="!open" viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
            <path d="M6 18 18 6M6 6l12 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="open" id="mobile-nav" class="border-t border-outline bg-surface md:hidden">
      <nav class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="focus-ring rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-variant"
          active-class="!bg-primary-container !text-on-primary-container"
          @click="open = false"
        >
          {{ $t(link.label) }}
        </RouterLink>

        <div class="mt-1 border-t border-outline pt-3 sm:hidden">
          <LanguageSwitcher />
        </div>
      </nav>
    </div>
  </header>
</template>
