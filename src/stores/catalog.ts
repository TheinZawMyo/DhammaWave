import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api } from '@/api/client'
import type { Audio, AudioCategory, AudioType, Teacher } from '@/api/types'

interface HomePayload {
  featured: Audio[]
  latest: Audio[]
  teachers: Teacher[]
  categories: AudioCategory[]
  audio_types: AudioType[]
}

const EMPTY_HOME: HomePayload = {
  featured: [],
  latest: [],
  teachers: [],
  categories: [],
  audio_types: [],
}

export const useCatalogStore = defineStore('catalog', () => {
  const home = ref<HomePayload>({ ...EMPTY_HOME })
  const teachers = ref<Teacher[]>([])
  const categories = ref<AudioCategory[]>([])
  const audioTypes = ref<AudioType[]>([])

  const loading = ref(false)
  const loaded = ref(false)
  const error = ref<string | null>(null)

  let inflight: Promise<void> | null = null

  /**
   * Load the home payload once and reuse it across pages.
   */
  async function ensureHome(force = false): Promise<void> {
    if (loaded.value && !force) return
    if (inflight && !force) return inflight

    loading.value = true
    error.value = null

    inflight = (async () => {
      try {
        const [homeResponse, teachersResponse, categoriesResponse, typesResponse] = await Promise.all([
          api.home(),
          api.teachers(),
          api.categories(),
          api.audioTypes(),
        ])

        home.value = {
          featured: homeResponse.data.featured,
          latest: homeResponse.data.latest,
          teachers: homeResponse.data.teachers,
          categories: homeResponse.data.categories,
          audio_types: homeResponse.data.audio_types,
        }

        teachers.value = teachersResponse.data
        categories.value = categoriesResponse.data
        audioTypes.value = typesResponse.data
        loaded.value = true
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : 'Unable to load the catalog.'
      } finally {
        loading.value = false
        inflight = null
      }
    })()

    return inflight
  }

  async function ensureTaxonomy(force = false): Promise<void> {
    if (loaded.value && !force) return

    if (!loaded.value) {
      await ensureHome()
      return
    }

    try {
      const [teachersResponse, categoriesResponse, typesResponse] = await Promise.all([
        api.teachers(),
        api.categories(),
        api.audioTypes(),
      ])

      teachers.value = teachersResponse.data
      categories.value = categoriesResponse.data
      audioTypes.value = typesResponse.data
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load filters.'
    }
  }

  function teacherBySlug(slug: string): Teacher | undefined {
    return teachers.value.find((teacher) => teacher.slug === slug)
  }

  function categoryBySlug(slug: string): AudioCategory | undefined {
    return categories.value.find((category) => category.slug === slug)
  }

  function typeBySlug(slug: string): AudioType | undefined {
    return audioTypes.value.find((type) => type.slug === slug)
  }

  const featured = computed(() => home.value.featured)
  const latest = computed(() => home.value.latest)

  return {
    home,
    teachers,
    categories,
    audioTypes,
    featured,
    latest,
    loading,
    loaded,
    error,
    ensureHome,
    ensureTaxonomy,
    teacherBySlug,
    categoryBySlug,
    typeBySlug,
  }
})
