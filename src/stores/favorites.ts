import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import type { Audio } from '@/api/types'

const STORAGE_KEY = 'dhammawave.favorites'

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const slugs = ref<string[]>(readStored())

  watch(
    slugs,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function isFavorite(slug: string): boolean {
    return slugs.value.includes(slug)
  }

  function toggle(audio: Audio): void {
    if (isFavorite(audio.slug)) {
      slugs.value = slugs.value.filter((slug) => slug !== audio.slug)
      return
    }

    slugs.value = [audio.slug, ...slugs.value]
  }

  const count = computed(() => slugs.value.length)

  return { slugs, count, isFavorite, toggle }
})
