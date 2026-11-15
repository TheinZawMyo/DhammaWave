<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { api } from '@/api/client'
import type { Audio, Teacher } from '@/api/types'
import AudioRow from '@/components/AudioRow.vue'
import MediaImage from '@/components/MediaImage.vue'
import StateView from '@/components/StateView.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const teacher = ref<Teacher | null>(null)
const audios = ref<Audio[]>([])

const loading = ref(true)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  teacher.value = null
  audios.value = []

  try {
    const [teacherResponse, audiosResponse] = await Promise.all([
      api.teacher(slug.value),
      api.audios({ teacher: slug.value, limit: 50 }),
    ])

    teacher.value = teacherResponse.data
    audios.value = audiosResponse.data
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to load this teacher.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(slug, load)
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <StateView
      v-if="error"
      :title="$t('teacherNotFound')"
      :subtitle="$t('errorNetworkSubtitle')"
      retry
      @retry="load"
    />

    <div v-else-if="loading" class="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr]">
      <div class="h-56 animate-pulse rounded-3xl bg-surface-variant" />
      <div class="space-y-3">
        <div class="h-8 w-1/2 animate-pulse rounded bg-surface-variant" />
        <div class="h-4 w-full animate-pulse rounded bg-surface-variant" />
        <div class="h-4 w-3/4 animate-pulse rounded bg-surface-variant" />
      </div>
    </div>

    <template v-else-if="teacher">
      <nav class="mb-6 flex items-center gap-2 text-sm text-muted">
        <RouterLink :to="{ name: 'teachers' }" class="focus-ring rounded transition hover:text-primary">
          {{ $t('navTeachers') }}
        </RouterLink>
        <span aria-hidden="true">/</span>
        <span class="truncate font-semibold text-ink">{{ teacher.name }}</span>
      </nav>

      <div class="grid gap-8 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-12">
        <div>
          <div class="overflow-hidden rounded-3xl border border-outline bg-surface shadow-sm">
            <div class="aspect-square bg-surface-variant">
              <MediaImage :src="teacher.photo_url" :alt="teacher.name" loading="eager" />
            </div>
          </div>
        </div>

        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl">
            {{ teacher.name }}
          </h1>

          <p v-if="teacher.short_name && teacher.short_name !== teacher.name" class="mt-2 text-lg text-muted">
            {{ teacher.short_name }}
          </p>

          <section v-if="teacher.bio" class="mt-6">
            <h2 class="mb-2 text-lg font-extrabold text-ink">{{ $t('teacherBio') }}</h2>
            <p class="leading-relaxed whitespace-pre-line text-ink/80">{{ teacher.bio }}</p>
          </section>

          <section class="mt-10">
            <h2 class="mb-4 text-xl font-extrabold tracking-tight text-ink">
              {{ $t('teacherAudios', { teacher: teacher.short_name || teacher.name }) }}
            </h2>

            <div v-if="audios.length" class="space-y-3">
              <AudioRow v-for="audio in audios" :key="audio.id" :audio="audio" />
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
