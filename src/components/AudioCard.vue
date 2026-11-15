<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import MediaImage from '@/components/MediaImage.vue'
import type { Audio } from '@/api/types'
import { useFavoritesStore } from '@/stores/favorites'
import { usePlayerStore } from '@/stores/player'
import { durationLabel } from '@/utils/format'

const props = defineProps<{
  audio: Audio
}>()

const player = usePlayerStore()
const favorites = useFavoritesStore()
const { t } = useI18n()

const isCurrent = computed(() => player.current?.slug === props.audio.slug)
const isActive = computed(() => isCurrent.value && player.isPlaying)
const isFavorite = computed(() => favorites.isFavorite(props.audio.slug))

const duration = computed(() => durationLabel(props.audio.duration_seconds, t))
</script>

<template>
  <article
    class="card-surface group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
  >
    <RouterLink
      :to="{ name: 'audio-detail', params: { slug: audio.slug } }"
      class="focus-ring relative block aspect-square overflow-hidden bg-surface-variant"
    >
      <MediaImage
        :src="audio.cover_image_url"
        :alt="audio.title"
        class="size-full transition duration-500 group-hover:scale-105"
      />

      <span
        v-if="isActive"
        class="absolute inset-0 grid place-items-center bg-primary/35"
        aria-hidden="true"
      >
        <span class="flex items-end gap-1">
          <span class="h-4 w-1 animate-pulse rounded-full bg-white" />
          <span class="h-7 w-1 animate-pulse rounded-full bg-white [animation-delay:150ms]" />
          <span class="h-5 w-1 animate-pulse rounded-full bg-white [animation-delay:300ms]" />
        </span>
      </span>
    </RouterLink>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex items-start justify-between gap-2">
        <RouterLink
          :to="{ name: 'audio-detail', params: { slug: audio.slug } }"
          class="focus-ring line-clamp-2 rounded text-base font-bold leading-snug text-ink transition hover:text-primary"
        >
          {{ audio.title }}
        </RouterLink>
        <button
          type="button"
          class="focus-ring -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-variant hover:text-primary"
          :class="{ '!text-primary': isFavorite }"
          :aria-label="audio.title"
          @click="favorites.toggle(audio)"
        >
          <svg
            viewBox="0 0 24 24"
            class="size-5"
            :fill="isFavorite ? 'currentColor' : 'none'"
            aria-hidden="true"
          >
            <path
              d="M12 20.25s-7.5-4.36-9.33-8.6a5.1 5.1 0 0 1 9.33-4.07A5.1 5.1 0 0 1 21.33 11.65C19.5 15.89 12 20.25 12 20.25Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <p class="text-sm text-muted">
        <RouterLink
          :to="{ name: 'teacher-detail', params: { slug: audio.teacher.slug } }"
          class="focus-ring rounded transition hover:text-primary"
        >
          {{ audio.teacher.name }}
        </RouterLink>
      </p>

      <div class="mt-auto flex items-center justify-between gap-2 pt-1">
        <span class="rounded-full bg-surface-variant px-2.5 py-1 text-xs font-semibold text-ink/80">
          {{ audio.type?.name }}
        </span>

        <button
          type="button"
          class="focus-ring grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-dark"
          :aria-label="isActive ? $t('audioPause') : $t('audioListen')"
          @click="player.play(audio)"
        >
          <svg v-if="isActive" viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1.4" />
            <rect x="14" y="5" width="4" height="14" rx="1.4" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="size-5 translate-x-px" fill="currentColor" aria-hidden="true">
            <path d="M7 4.8v14.4c0 .9 1 1.5 1.8 1l11-7.2a1.2 1.2 0 0 0 0-2L8.8 3.8A1.1 1.1 0 0 0 7 4.8z" />
          </svg>
        </button>
      </div>

      <p class="text-xs text-muted/80">{{ duration }}</p>
    </div>
  </article>
</template>
