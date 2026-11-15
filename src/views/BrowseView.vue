<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { api } from '@/api/client'
import type { Audio } from '@/api/types'
import AudioRow from '@/components/AudioRow.vue'
import AudioRowSkeleton from '@/components/AudioRowSkeleton.vue'
import StateView from '@/components/StateView.vue'
import { useCatalogStore } from '@/stores/catalog'
import { usePlayerStore } from '@/stores/player'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const player = usePlayerStore()

const search = ref((route.query.query as string) ?? '')
const teacher = ref((route.query.teacher as string) ?? '')
const category = ref((route.query.category as string) ?? '')
const type = ref((route.query.type as string) ?? '')

const audios = ref<Audio[]>([])
const nextCursor = ref<string | null>(null)
const hasMore = ref(false)
const total = ref(0)

const loading = ref(true)
const loadingMore = ref(false)
const error = ref<string | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | undefined

async function fetchPage(reset = true): Promise<void> {
  if (reset) {
    loading.value = true
  } else {
    loadingMore.value = true
  }

  error.value = null

  try {
    const response = await api.audios({
      query: search.value || undefined,
      teacher: teacher.value || undefined,
      category: category.value || undefined,
      type: type.value || undefined,
      cursor: reset ? undefined : (nextCursor.value ?? undefined),
      limit: 20,
    })

    if (reset) {
      audios.value = response.data
    } else {
      audios.value = [...audios.value, ...response.data]
    }

    nextCursor.value = response.meta.pagination.next_cursor
    hasMore.value = response.meta.pagination.has_more
    total.value = response.meta.pagination.total
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load audios.'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

function syncQuery(): void {
  router.replace({
    name: 'browse',
    query: {
      ...(search.value ? { query: search.value } : {}),
      ...(teacher.value ? { teacher: teacher.value } : {}),
      ...(category.value ? { category: category.value } : {}),
      ...(type.value ? { type: type.value } : {}),
    },
  })
}

function applyFilters(): void {
  syncQuery()
  void fetchPage(true)
}

function clearFilters(): void {
  search.value = ''
  teacher.value = ''
  category.value = ''
  type.value = ''
  applyFilters()
}

watch(search, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(applyFilters, 350)
})

watch([teacher, category, type], applyFilters)

onMounted(async () => {
  await catalog.ensureTaxonomy()
  await fetchPage(true)
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <header class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {{ $t('browseTitle') }}
      </h1>
    </header>

    <div class="card-surface mb-8 p-4 sm:p-5">
      <label class="relative block">
        <span class="sr-only">{{ $t('browseSearchHint') }}</span>
        <svg
          class="pointer-events-none absolute start-4 top-1/2 size-4.5 -translate-y-1/2 text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          v-model="search"
          type="search"
          :placeholder="$t('browseSearchHint')"
          class="focus-ring w-full rounded-2xl border border-outline bg-background py-3 ps-11 pe-4 text-sm text-ink placeholder:text-muted/70 focus:border-primary"
        />
      </label>

      <div class="mt-4 grid gap-3 sm:grid-cols-3">
        <label class="flex min-w-0 flex-col gap-1.5">
          <span class="text-xs font-bold tracking-wide text-muted uppercase">{{ $t('browseFilterTeacher') }}</span>
          <select
            v-model="teacher"
            class="focus-ring w-full min-w-0 cursor-pointer rounded-xl border border-outline bg-background px-3 py-2.5 text-sm font-semibold text-ink focus:border-primary"
          >
            <option value="">{{ $t('browseFilterTeacher') }} — {{ $t('filterAll') }}</option>
            <option v-for="item in catalog.teachers" :key="item.id" :value="item.slug">
              {{ item.name }}
            </option>
          </select>
        </label>

        <label class="flex min-w-0 flex-col gap-1.5">
          <span class="text-xs font-bold tracking-wide text-muted uppercase">{{ $t('browseFilterCategory') }}</span>
          <select
            v-model="category"
            class="focus-ring w-full min-w-0 cursor-pointer rounded-xl border border-outline bg-background px-3 py-2.5 text-sm font-semibold text-ink focus:border-primary"
          >
            <option value="">{{ $t('browseFilterCategory') }} — {{ $t('filterAll') }}</option>
            <option v-for="item in catalog.categories" :key="item.id" :value="item.slug">
              {{ item.name }}
            </option>
          </select>
        </label>

        <label class="flex min-w-0 flex-col gap-1.5">
          <span class="text-xs font-bold tracking-wide text-muted uppercase">{{ $t('browseFilterType') }}</span>
          <select
            v-model="type"
            class="focus-ring w-full min-w-0 cursor-pointer rounded-xl border border-outline bg-background px-3 py-2.5 text-sm font-semibold text-ink focus:border-primary"
          >
            <option value="">{{ $t('browseFilterType') }} — {{ $t('filterAll') }}</option>
            <option v-for="item in catalog.audioTypes" :key="item.id" :value="item.slug">
              {{ item.name }}
            </option>
          </select>
        </label>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-muted">
          {{ $t('browseResultCount', { count: total }) }}
        </p>

        <button
          v-if="search || teacher || category || type"
          type="button"
          class="focus-ring rounded-full border border-outline px-4 py-2 text-sm font-bold text-muted transition hover:border-primary hover:text-primary"
          @click="clearFilters"
        >
          {{ $t('browseFilterClear') }}
        </button>
      </div>
    </div>

    <StateView
      v-if="error && !audios.length"
      :title="$t('errorTitle')"
      :subtitle="$t('errorNetworkSubtitle')"
      retry
      @retry="fetchPage(true)"
    />

    <div v-else class="space-y-3">
      <template v-if="loading && !audios.length">
        <AudioRowSkeleton v-for="index in 4" :key="index" />
      </template>

      <div v-if="!loading && !audios.length" class="card-surface px-6 py-16 text-center">
        <p class="text-lg font-bold text-ink">{{ $t('browseEmptyTitle') }}</p>
        <p class="mt-2 text-sm text-muted">{{ $t('browseEmptySubtitle') }}</p>
      </div>

      <AudioRow v-for="audio in audios" :key="audio.id" :audio="audio" />
    </div>

    <div v-if="hasMore" class="mt-8 flex justify-center">
      <button
        type="button"
        class="focus-ring rounded-2xl border border-outline bg-surface px-6 py-3 text-sm font-bold text-primary-dark transition hover:border-primary disabled:opacity-60"
        :disabled="loadingMore"
        @click="fetchPage(false)"
      >
        {{ loadingMore ? $t('browseLoadingMore') : $t('browseLoadMore') }}
      </button>
    </div>
  </div>
</template>
