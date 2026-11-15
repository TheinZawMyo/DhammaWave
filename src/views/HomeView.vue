<script setup lang="ts">
import { computed, onMounted } from 'vue'

import AudioCard from '@/components/AudioCard.vue'
import AudioCardSkeleton from '@/components/AudioCardSkeleton.vue'
import MediaImage from '@/components/MediaImage.vue'
import StateView from '@/components/StateView.vue'
import TeacherCard from '@/components/TeacherCard.vue'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()

const featured = computed(() => catalog.featured)
const latest = computed(() => catalog.latest)

onMounted(() => {
  void catalog.ensureHome()
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-outline bg-gradient-to-br from-primary-container via-background to-background">
      <div
        class="pointer-events-none absolute -top-24 -end-16 size-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p class="text-xs font-bold tracking-[0.18em] text-primary uppercase">
            {{ $t('heroEyebrow') }}
          </p>

          <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl">
            {{ $t('heroTitle') }}
          </h1>

          <p class="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {{ $t('heroSubtitle') }}
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <RouterLink
              :to="{ name: 'browse' }"
              class="focus-ring inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
            >
              {{ $t('heroPrimaryCta') }}
              <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </RouterLink>

            <RouterLink
              :to="{ name: 'download' }"
              class="focus-ring inline-flex items-center gap-2 rounded-2xl border border-outline bg-surface px-6 py-3.5 text-sm font-bold text-primary-dark transition hover:border-primary"
            >
              <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {{ $t('heroSecondaryCta') }}
            </RouterLink>
          </div>
        </div>

        <div class="relative">
          <div class="grid grid-cols-2 items-start gap-4">
            <div
              v-for="(audio, index) in featured.slice(0, 4)"
              :key="audio.id"
              class="overflow-hidden rounded-2xl border border-outline bg-surface shadow-sm"
              :class="index % 2 === 1 ? 'mt-6' : ''"
            >
              <div class="aspect-square overflow-hidden bg-surface-variant">
                <MediaImage :src="audio.cover_image_url" :alt="audio.title" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <StateView
        v-if="catalog.error && !catalog.loaded"
        :title="$t('errorTitle')"
        :subtitle="$t('errorNetworkSubtitle')"
        retry
        @retry="catalog.ensureHome(true)"
      />

      <template v-else>
        <section v-if="featured.length" class="mb-16">
          <div class="mb-6 flex items-end justify-between gap-4">
            <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {{ $t('homeFeatured') }}
            </h2>
            <RouterLink
              :to="{ name: 'browse' }"
              class="focus-ring shrink-0 rounded text-sm font-bold text-primary transition hover:text-primary-dark"
            >
              {{ $t('homeViewAll') }} →
            </RouterLink>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AudioCard v-for="audio in featured" :key="audio.id" :audio="audio" />
          </div>
        </section>

        <section v-if="catalog.categories.length || catalog.audioTypes.length" class="mb-16">
          <h2 class="mb-6 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {{ $t('homeCategories') }}
          </h2>

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="card-surface p-5">
              <h3 class="mb-3 text-sm font-bold tracking-wide text-muted uppercase">
                {{ $t('homeCategories') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <RouterLink
                  v-for="category in catalog.categories"
                  :key="category.id"
                  :to="{ name: 'browse', query: { category: category.slug } }"
                  class="focus-ring chip-surface px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:bg-primary-container hover:text-on-primary-container"
                >
                  {{ category.name }}
                </RouterLink>
              </div>
            </div>

            <div class="card-surface p-5">
              <h3 class="mb-3 text-sm font-bold tracking-wide text-muted uppercase">
                {{ $t('homeAudioTypes') }}
              </h3>
              <div class="flex flex-wrap gap-2">
                <RouterLink
                  v-for="type in catalog.audioTypes"
                  :key="type.id"
                  :to="{ name: 'browse', query: { type: type.slug } }"
                  class="focus-ring chip-surface px-3.5 py-2 text-sm font-semibold text-ink transition hover:border-primary hover:bg-primary-container hover:text-on-primary-container"
                >
                  {{ type.name }}
                </RouterLink>
              </div>
            </div>
          </div>
        </section>

        <section v-if="catalog.teachers.length" class="mb-16">
          <div class="mb-6 flex items-end justify-between gap-4">
            <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {{ $t('homeTeachers') }}
            </h2>
            <RouterLink
              :to="{ name: 'teachers' }"
              class="focus-ring shrink-0 rounded text-sm font-bold text-primary transition hover:text-primary-dark"
            >
              {{ $t('homeViewAll') }} →
            </RouterLink>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TeacherCard v-for="teacher in catalog.teachers" :key="teacher.id" :teacher="teacher" />
          </div>
        </section>

        <section v-if="latest.length" class="mb-16">
          <div class="mb-6 flex items-end justify-between gap-4">
            <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {{ $t('homeLatest') }}
            </h2>
            <RouterLink
              :to="{ name: 'browse' }"
              class="focus-ring shrink-0 rounded text-sm font-bold text-primary transition hover:text-primary-dark"
            >
              {{ $t('homeViewAll') }} →
            </RouterLink>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <AudioCard v-for="audio in latest" :key="audio.id" :audio="audio" />
          </div>
        </section>

        <section
          v-if="!catalog.loading && !featured.length && !latest.length"
          class="card-surface px-6 py-16 text-center"
        >
          <p class="text-lg font-bold text-ink">{{ $t('browseEmptyTitle') }}</p>
          <p class="mt-2 text-sm text-muted">{{ $t('browseEmptySubtitle') }}</p>
        </section>

        <div v-else-if="catalog.loading && !latest.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AudioCardSkeleton v-for="index in 4" :key="index" />
        </div>
      </template>
    </div>

    <section class="border-y border-outline bg-surface">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-12 sm:px-6 lg:flex-row"
      >
        <div class="max-w-xl text-center lg:text-left">
          <h2 class="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {{ $t('downloadTitle') }}
          </h2>
          <p class="mt-3 text-muted">{{ $t('downloadSubtitle') }}</p>
        </div>

        <RouterLink
          :to="{ name: 'download' }"
          class="focus-ring inline-flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
        >
          <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          {{ $t('navDownload') }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>
