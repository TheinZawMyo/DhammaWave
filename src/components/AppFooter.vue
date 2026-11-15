<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const year = new Date().getFullYear()

const explore = [
  { name: 'home', label: 'navHome' },
  { name: 'browse', label: 'navBrowse' },
  { name: 'teachers', label: 'navTeachers' },
  { name: 'download', label: 'navDownload' },
] as const

const legal = [
  { name: 'privacy', label: 'navPrivacy' },
] as const
</script>

<template>
  <footer class="mt-20 border-t border-outline bg-surface">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2.5">
          <span class="grid size-9 place-items-center rounded-xl bg-primary text-lg text-white" aria-hidden="true">☸</span>
          <span class="text-lg font-bold text-primary">DhammaWave</span>
        </div>
        <p class="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          {{ $t('appTagline') }}
        </p>
        <p class="mt-3 max-w-sm text-xs leading-relaxed text-muted">
          {{ $t('footerBuiltWith') }}
        </p>
      </div>

      <nav aria-label="Explore">
        <h2 class="text-sm font-bold tracking-wide text-ink uppercase">{{ $t('footerExplore') }}</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="link in explore" :key="link.name">
            <RouterLink
              :to="{ name: link.name }"
              class="focus-ring rounded text-sm text-muted transition hover:text-primary"
            >
              {{ $t(link.label) }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <nav aria-label="Legal">
        <h2 class="text-sm font-bold tracking-wide text-ink uppercase">{{ $t('footerLegal') }}</h2>
        <ul class="mt-3 space-y-2">
          <li v-for="link in legal" :key="link.name">
            <RouterLink
              :to="{ name: link.name }"
              class="focus-ring rounded text-sm text-muted transition hover:text-primary"
            >
              {{ $t(link.label) }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>

    <div class="border-t border-outline">
      <div class="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
        {{ $t('footerRights', { year }) }}
      </div>
    </div>
  </footer>
</template>
