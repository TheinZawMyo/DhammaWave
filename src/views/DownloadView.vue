<script setup lang="ts">
import { computed, ref } from 'vue'

import QrCode from '@/components/QrCode.vue'

const APK_URL = import.meta.env.VITE_ANDROID_APK_URL ?? '/downloads/dhammawave.apk'
const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '1.0.0'
const APK_SIZE = import.meta.env.VITE_ANDROID_APK_SIZE ?? ''

/**
 * Download platforms. The buttons are rendered without a link on purpose —
 * wire the store URLs up once the listings are live.
 */
const platforms = [
  {
    id: 'android',
    label: 'downloadCtaAndroid',
    requirement: 'downloadRequirementAndroid',
    platform: 'downloadPlatformAndroid',
    icon: 'android',
  },
  {
    id: 'ios',
    label: 'downloadCtaIos',
    requirement: 'downloadRequirementIos',
    platform: 'downloadPlatformIos',
    icon: 'ios',
  },
] as const

const openFaq = ref<number | null>(0)

const features = [
  {
    key: 'downloadFeatureOffline',
    body: 'downloadFeatureOfflineBody',
    icon: 'M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  },
  {
    key: 'downloadFeatureBackground',
    body: 'downloadFeatureBackgroundBody',
    icon: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  },
  {
    key: 'downloadFeatureSpeed',
    body: 'downloadFeatureSpeedBody',
    icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2',
  },
  {
    key: 'downloadFeatureQueue',
    body: 'downloadFeatureQueueBody',
    icon: 'M4 6h16M4 12h16M4 18h10',
  },
  {
    key: 'downloadFeatureFavorites',
    body: 'downloadFeatureFavoritesBody',
    icon: 'M12 20.25s-7.5-4.36-9.33-8.6a5.1 5.1 0 0 1 9.33-4.07A5.1 5.1 0 0 1 21.33 11.65C19.5 15.89 12 20.25 12 20.25Z',
  },
  {
    key: 'downloadFeaturePrivacy',
    body: 'downloadFeaturePrivacyBody',
    icon: 'M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4',
  },
] as const

const steps = ['downloadStep1', 'downloadStep2', 'downloadStep3'] as const

const faqs = [
  { q: 'downloadFaq1Q', a: 'downloadFaq1A' },
  { q: 'downloadFaq2Q', a: 'downloadFaq2A' },
  { q: 'downloadFaq3Q', a: 'downloadFaq3A' },
  { q: 'downloadFaq4Q', a: 'downloadFaq4A' },
  { q: 'downloadFaq5Q', a: 'downloadFaq5A' },
] as const

const downloadUrl = computed(() => new URL(APK_URL, window.location.origin).href)

function toggleFaq(index: number): void {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-outline bg-gradient-to-br from-player-top via-primary to-player-bottom">
      <div
        class="pointer-events-none absolute -top-20 -start-16 size-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p class="text-xs font-bold tracking-[0.18em text-white/80 uppercase">
            {{ $t('downloadEyebrow') }}
          </p>

          <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-balance text-white sm:text-5xl">
            {{ $t('downloadTitle') }}
          </h1>

          <p class="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            {{ $t('downloadSubtitle') }}
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <button
              v-for="(platform, index) in platforms"
              :key="platform.id"
              type="button"
              class="focus-ring inline-flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-lg transition"
              :class="
                index === 0
                  ? 'bg-white text-player-bottom hover:bg-surface-variant'
                  : 'border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20'
              "
            >
<svg
                v-if="platform.icon === 'android'"
                viewBox="0 0 24 24"
                class="size-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 9.53c-.31-1.05-.91-1.98-1.72-2.71l.71-.74a.5.5 0 0 0-.72-.7l-.73.76a7.9 7.9 0 0 0-2.4-.74V4.9a.5.5 0 0 0-1 0v1.5a7.9 7.9 0 0 0-2.4.74l-.73-.76a.5.5 0 1 0-.72.7l.71.74a6.3 6.3 0 0 0-1.72 2.71A6.6 6.6 0 0 0 4 12.3c0 .36.03.71.1 1.05a.5.5 0 0 0 .98-.2 5.8 5.8 0 0 1 0-.85c0-3.32 3.14-6.03 7-6.03s7 2.71 7 6.03a5.8 5.8 0 0 1 0 .85.5.5 0 1 0 .98.2c.07-.34.1-.69.1-1.05a6.6 6.6 0 0 0-1.16-3.77ZM7 11.2a1.1 1.1 0 1 1 2.2 0 1.1 1.1 0 0 1-2.2 0Zm9.1 0a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
              </svg>
<svg
                v-else
                viewBox="0 0 24 24"
                class="size-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.36 12.78c.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.72-1.35-.14-2.64.79-3.33.79-.69 0-1.75-.77-2.87-.75-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71s1.7.71 2.86.69c1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.51ZM14.2 6.4c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.01 1.7-.89 2.7.97.08 1.96-.49 2.55-1.23Z" />
              </svg>
              {{ $t(platform.label) }}
            </button>
          </div>

          <p class="mt-3 text-xs text-white/70">{{ $t('downloadLinksNote') }}</p>

          <dl class="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt class="text-white/60">{{ $t('downloadVersion') }}</dt>
              <dd class="mt-0.5 font-bold text-white">{{ APP_VERSION }}</dd>
            </div>
            <div v-if="APK_SIZE">
              <dt class="text-white/60">{{ $t('downloadSize') }}</dt>
              <dd class="mt-0.5 font-bold text-white">{{ APK_SIZE }}</dd>
            </div>
            <div v-for="platform in platforms" :key="platform.id">
              <dt class="text-white/60">{{ $t(platform.platform) }}</dt>
              <dd class="mt-0.5 font-bold text-white">{{ $t(platform.requirement) }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex flex-col items-center gap-6">
          <div class="w-full max-w-sm rounded-[2rem] border-4 border-white/20 bg-player-bottom/40 p-6 shadow-2xl backdrop-blur-sm">
            <div class="rounded-3xl bg-surface p-6">
              <div class="flex items-center gap-3">
                <img src="/app-icon.jpg" alt="DhammaWave" class="size-14 rounded-2xl shadow-sm" />
                <div class="min-w-0">
                  <p class="truncate text-base font-extrabold text-ink">DhammaWave</p>
                  <p class="truncate text-xs text-muted">{{ $t('appTagline') }}</p>
                </div>
                <span class="ms-auto shrink-0 rounded-full bg-surface-variant px-2.5 py-1 text-[10px] font-bold text-ink/70">
                  APK
                </span>
              </div>

              <div class="mt-5 space-y-2">
                <div class="h-2.5 w-full animate-pulse rounded-full bg-surface-variant" />
                <div class="h-2.5 w-4/5 animate-pulse rounded-full bg-surface-variant" />
                <div class="h-2.5 w-2/3 animate-pulse rounded-full bg-surface-variant" />
              </div>
            </div>

            <div class="mt-6 flex flex-col items-center gap-3">
              <div class="rounded-2xl bg-white p-3">
                <QrCode :value="downloadUrl" :size="168" />
              </div>
              <p class="text-center text-xs font-semibold text-white/80">
                {{ $t('downloadQrAndroidCaption') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {{ $t('downloadFeaturesTitle') }}
      </h2>

      <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="feature in features" :key="feature.key" class="card-surface p-6">
          <span class="grid size-11 place-items-center rounded-xl bg-primary-container text-primary-dark" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="size-5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path :d="feature.icon" />
            </svg>
          </span>

          <h3 class="mt-4 text-base font-bold text-ink">{{ $t(feature.key) }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ $t(feature.body) }}</p>
        </div>
      </div>
    </section>

    <section class="border-y border-outline bg-surface">
      <div class="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {{ $t('downloadInstallTitle') }}
          </h2>

          <ol class="mt-8 space-y-5">
            <li v-for="(step, index) in steps" :key="step" class="flex gap-4">
              <span
                class="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-white"
                aria-hidden="true"
              >
                {{ index + 1 }}
              </span>
              <p class="pt-1.5 text-ink/85">{{ $t(step) }}</p>
            </li>
          </ol>

          <div class="mt-8 flex flex-wrap gap-3">
            <button
              v-for="(platform, index) in platforms"
              :key="platform.id"
              type="button"
              class="focus-ring inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold shadow-sm transition"
              :class="
                index === 0
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'border border-outline bg-surface text-primary-dark hover:border-primary'
              "
            >
<svg
                v-if="platform.icon === 'android'"
                viewBox="0 0 24 24"
                class="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.05 9.53c-.31-1.05-.91-1.98-1.72-2.71l.71-.74a.5.5 0 0 0-.72-.7l-.73.76a7.9 7.9 0 0 0-2.4-.74V4.9a.5.5 0 0 0-1 0v1.5a7.9 7.9 0 0 0-2.4.74l-.73-.76a.5.5 0 1 0-.72.7l.71.74a6.3 6.3 0 0 0-1.72 2.71A6.6 6.6 0 0 0 4 12.3c0 .36.03.71.1 1.05a.5.5 0 0 0 .98-.2 5.8 5.8 0 0 1 0-.85c0-3.32 3.14-6.03 7-6.03s7 2.71 7 6.03a5.8 5.8 0 0 1 0 .85.5.5 0 1 0 .98.2c.07-.34.1-.69.1-1.05a6.6 6.6 0 0 0-1.16-3.77ZM7 11.2a1.1 1.1 0 1 1 2.2 0 1.1 1.1 0 0 1-2.2 0Zm9.1 0a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z" />
              </svg>
<svg
                v-else
                viewBox="0 0 24 24"
                class="size-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.36 12.78c.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.61-1.7-3.18-1.72-1.35-.14-2.64.79-3.33.79-.69 0-1.75-.77-2.87-.75-1.47.02-2.83.86-3.59 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.51-.71 2.84-.71s1.7.71 2.86.69c1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.3-.88-2.32-3.51ZM14.2 6.4c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.01 1.7-.89 2.7.97.08 1.96-.49 2.55-1.23Z" />
              </svg>
              {{ $t(platform.label) }}
            </button>
          </div>

          <p class="mt-4 max-w-md text-sm leading-relaxed text-muted">{{ $t('downloadNote') }}</p>
        </div>

        <div class="card-surface p-6 sm:p-8">
          <h2 class="text-xl font-extrabold tracking-tight text-ink">
            {{ $t('downloadFaqTitle') }}
          </h2>

          <div class="mt-5 divide-y divide-outline">
            <div v-for="(faq, index) in faqs" :key="faq.q" class="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                class="focus-ring flex w-full items-center justify-between gap-4 rounded text-left"
                :aria-expanded="openFaq === index"
                @click="toggleFaq(index)"
              >
                <span class="font-bold text-ink">{{ $t(faq.q) }}</span>
                <svg
                  viewBox="0 0 24 24"
                  class="size-4 shrink-0 text-muted transition-transform duration-200"
                  :class="{ 'rotate-180': openFaq === index }"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <p
                v-show="openFaq === index"
                class="mt-3 text-sm leading-relaxed text-muted"
              >
                {{ $t(faq.a) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
