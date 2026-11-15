<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import MediaImage from '@/components/MediaImage.vue'
import { usePlayerStore } from '@/stores/player'
import { formatDuration } from '@/utils/format'

const player = usePlayerStore()

const expanded = ref(false)

const progress = computed(() => player.progress)

watch(
  () => player.current,
  (audio) => {
    if (!audio) expanded.value = false
  },
)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="player.current"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-outline bg-surface/95 backdrop-blur-md"
    >
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          class="h-1 w-full overflow-hidden rounded-full bg-surface-variant"
          role="progressbar"
          :aria-valuenow="Math.round(progress)"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="h-full rounded-full bg-primary transition-[width] duration-200"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <div class="flex items-center gap-3 py-3 sm:gap-4">
          <RouterLink
            :to="{ name: 'audio-detail', params: { slug: player.current.slug } }"
            class="focus-ring flex min-w-0 flex-1 items-center gap-3 rounded-lg"
            @click="expanded = false"
          >
            <span class="size-11 shrink-0 overflow-hidden rounded-lg bg-surface-variant sm:size-12">
              <MediaImage :src="player.current.cover_image_url" :alt="player.current.title" />
            </span>

            <span class="min-w-0">
              <span class="block truncate text-sm font-bold text-ink">{{ player.current.title }}</span>
              <span class="block truncate text-xs text-muted">{{ player.current.teacher.name }}</span>
            </span>
          </RouterLink>

          <div class="flex shrink-0 items-center gap-1">
            <button
              type="button"
              class="focus-ring hidden size-10 place-items-center rounded-full text-muted transition hover:bg-surface-variant hover:text-primary sm:grid"
              :disabled="!player.hasPrevious"
              :aria-label="$t('playerSkipBack')"
              @click="player.skip(-10)"
            >
              <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 17 6 12l5-5" />
                <path d="M18 17l-5-5 5-5" />
              </svg>
            </button>

            <button
              type="button"
              class="focus-ring grid size-11 place-items-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary-dark"
            :aria-label="player.isPlaying ? $t('audioPause') : $t('audioResume')"
              @click="player.toggle()"
            >
              <svg v-if="player.isPlaying" viewBox="0 0 24 24" class="size-5" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1.4" />
                <rect x="14" y="5" width="4" height="14" rx="1.4" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="size-5 translate-x-px" fill="currentColor" aria-hidden="true">
                <path d="M7 4.8v14.4c0 .9 1 1.5 1.8 1l11-7.2a1.2 1.2 0 0 0 0-2L8.8 3.8A1.1 1.1 0 0 0 7 4.8z" />
              </svg>
            </button>

            <button
              type="button"
              class="focus-ring hidden size-10 place-items-center rounded-full text-muted transition hover:bg-surface-variant hover:text-primary sm:grid"
              :disabled="!player.hasNext"
              :aria-label="$t('playerSkipForward')"
              @click="player.skip(10)"
            >
              <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m13 17 5-5-5-5" />
                <path d="m6 17 5-5-5-5" />
              </svg>
            </button>

            <button
              type="button"
              class="focus-ring grid size-10 place-items-center rounded-full text-muted transition hover:bg-surface-variant hover:text-primary"
              :aria-label="$t('playerClose')"
              @click="player.stop()"
            >
              <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 pb-3 text-xs text-muted">
          <span class="tabular-nums">{{ formatDuration(player.currentTime) }}</span>

          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2">
              <span class="sr-only">{{ $t('playerSpeedTitle') }}</span>
              <select
                class="focus-ring cursor-pointer rounded-full border border-outline bg-surface px-2 py-1 text-xs font-semibold"
                :value="player.speed"
                @change="player.setSpeed(Number(($event.target as HTMLSelectElement).value))"
              >
                <option v-for="value in player.speeds" :key="value" :value="value">{{ value }}x</option>
              </select>
            </label>
            <span class="tabular-nums">{{ formatDuration(player.duration || player.current.duration_seconds) }}</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
