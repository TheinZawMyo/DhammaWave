<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { api } from '@/api/client'
import type { Audio } from '@/api/types'
import AudioRow from '@/components/AudioRow.vue'
import MediaImage from '@/components/MediaImage.vue'
import StateView from '@/components/StateView.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { durationLabel, formatDate } from '@/utils/format'

const route = useRoute()
const player = usePlayerStore()
const favorites = useFavoritesStore()

const audio = ref<Audio | null>(null)
const related = ref<Audio[]>([])

const loading = ref(true)
const error = ref<string | null>(null)

const { t } = useI18n()

const isCurrent = computed(() => audio.value !== null && player.current?.slug === audio.value.slug)
const isPlaying = computed(() => isCurrent.value && player.isPlaying)
const isFavorite = computed(() => (audio.value ? favorites.isFavorite(audio.value.slug) : false))

const duration = computed(() =>
  audio.value ? durationLabel(audio.value.duration_seconds, t) : '',
)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  audio.value = null
  related.value = []

  const slug = route.params.slug as string

  try {
    const response = await api.audio(slug)
    audio.value = response.data

    const teacherAudios = await api.audios({ teacher: response.data.teacher.slug, limit: 12 })
    related.value = teacherAudios.data.filter((item) => item.slug !== slug).slice(0, 6)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load this audio.'
  } finally {
    loading.value = false
  }
}

async function share(): Promise<void> {
  if (!audio.value) return

  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({ title: audio.value.title, url })
      return
    } catch {
      // User dismissed the share sheet — fall through to the clipboard.
    }
  }

  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Clipboard is unavailable; nothing else to do.
  }
}

onMounted(load)
watch(() => route.params.slug, load)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <StateView
      v-if="error"
      :title="$t('audioNotFound')"
      :subtitle="$t('errorNetworkSubtitle')"
      retry
      @retry="load"
    />

    <div v-else-if="loading" class="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <div class="aspect-square animate-pulse rounded-3xl bg-surface-variant" />
      <div class="space-y-4">
        <div class="h-8 w-3/4 animate-pulse rounded bg-surface-variant" />
        <div class="h-4 w-1/2 animate-pulse rounded bg-surface-variant" />
        <div class="h-24 w-full animate-pulse rounded bg-surface-variant" />
      </div>
    </div>

    <template v-else-if="audio">
      <nav class="mb-6 flex items-center gap-2 text-sm text-muted">
        <RouterLink :to="{ name: 'home' }" class="focus-ring rounded transition hover:text-primary">
          {{ $t('navHome') }}
        </RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink :to="{ name: 'browse' }" class="focus-ring rounded transition hover:text-primary">
          {{ $t('navBrowse') }}
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span class="truncate font-semibold text-ink">{{ audio.title }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
        <div>
          <div class="overflow-hidden rounded-3xl border border-outline bg-surface shadow-sm">
            <div class="aspect-square bg-surface-variant">
              <MediaImage :src="audio.cover_image_url" :alt="audio.title" loading="eager" />
            </div>
          </div>

          <button
            type="button"
            class="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
            @click="player.play(audio)"
          >
            <svg v-if="isPlaying" viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1.4" />
              <rect x="14" y="5" width="4" height="14" rx="1.4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="size-5 translate-x-px" fill="currentColor" aria-hidden="true">
              <path d="M7 4.8v14.4c0 .9 1 1.5 1.8 1l11-7.2a1.2 1.2 0 0 0 0-2L8.8 3.8A1.1 1.1 0 0 0 7 4.8z" />
            </svg>
            {{ isPlaying ? $t('audioPause') : $t('audioListen') }}
          </button>

          <div class="mt-3 grid grid-cols-3 gap-3">
            <button
              type="button"
              class="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-3 py-2.5 text-sm font-bold transition hover:border-primary"
              :class="{ '!border-primary !text-primary': isFavorite }"
              :aria-label="isFavorite ? $t('audioRemoveFavorite') : $t('audioFavorite')"
              @click="favorites.toggle(audio)"
            >
              <svg
                viewBox="0 0 24 24"
                class="size-4"
                :fill="isFavorite ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20.25s-7.5-4.36-9.33-8.6a5.1 5.1 0 0 1 9.33-4.07A5.1 5.1 0 0 1 21.33 11.65C19.5 15.89 12 20.25 12 20.25Z" />
              </svg>
            </button>

            <button
              type="button"
              class="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-3 py-2.5 text-sm font-bold transition hover:border-primary"
              :aria-label="$t('audioShare')"
              @click="share"
            >
              <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.6 13.5 6.8 4" />
                <path d="m15.4 6.5-6.8 4" />
              </svg>
            </button>

            <RouterLink
              :to="{ name: 'download' }"
              class="focus-ring flex items-center justify-center gap-2 rounded-2xl border border-outline bg-surface px-3 py-2.5 text-sm font-bold transition hover:border-primary"
            >
              <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {{ $t('navDownload') }}
            </RouterLink>
          </div>
        </div>

        <div>
          <div class="flex flex-wrap gap-2">
            <span
              v-if="audio.type"
              class="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container"
            >
              {{ audio.type.name }}
            </span>
            <span
              v-for="item in audio.categories"
              :key="item.id"
              class="rounded-full bg-surface-variant px-3 py-1 text-xs font-bold text-ink/75"
            >
              {{ item.name }}
            </span>
          </div>

          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
            {{ audio.title }}
          </h1>

          <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <RouterLink
              :to="{ name: 'teacher-detail', params: { slug: audio.teacher.slug } }"
              class="focus-ring flex items-center gap-2 rounded font-semibold text-ink transition hover:text-primary"
            >
              <span class="size-8 overflow-hidden rounded-full bg-surface-variant">
                <MediaImage :src="audio.teacher.photo_url" :alt="audio.teacher.name" />
              </span>
              {{ audio.teacher.name }}
            </RouterLink>

            <span>{{ duration }}</span>

            <span v-if="audio.published_at">{{ $t('audioPublishedOn', { date: formatDate(audio.published_at) }) }}</span>
          </div>

          <section v-if="audio.description" class="mt-8">
            <h2 class="mb-3 text-lg font-extrabold text-ink">{{ $t('audioDescription') }}</h2>
            <p class="leading-relaxed whitespace-pre-line text-ink/80">{{ audio.description }}</p>
          </section>

          <section class="mt-10">
            <div class="mb-4 flex items-center justify-between gap-4">
              <h2 class="text-xl font-extrabold tracking-tight text-ink">
                {{ $t('teacherMoreTitle', { teacher: audio.teacher.short_name || audio.teacher.name }) }}
              </h2>
              <RouterLink
                :to="{ name: 'teacher-detail', params: { slug: audio.teacher.slug } }"
                class="focus-ring shrink-0 rounded text-sm font-bold text-primary transition hover:text-primary-dark"
              >
                {{ $t('homeViewAll') }} →
              </RouterLink>
            </div>

            <div v-if="related.length" class="space-y-3">
              <AudioRow v-for="item in related" :key="item.id" :audio="item" />
            </div>

            <p v-else class="card-surface px-5 py-8 text-center text-sm text-muted">
              {{ $t('browseEmptySubtitle') }}
            </p>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>
