<script setup lang="ts">
import { computed, onMounted } from 'vue'

import StateView from '@/components/StateView.vue'
import TeacherCard from '@/components/TeacherCard.vue'
import { useCatalogStore } from '@/stores/catalog'

const catalog = useCatalogStore()

const teachers = computed(() => catalog.teachers)

onMounted(() => {
  void catalog.ensureTaxonomy()
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <header class="mb-8 max-w-2xl">
      <h1 class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {{ $t('teachersTitle') }}
      </h1>
      <p class="mt-3 text-muted">{{ $t('teachersSubtitle') }}</p>
    </header>

    <StateView
      v-if="catalog.error && !teachers.length"
      :title="$t('errorTitle')"
      :subtitle="$t('errorNetworkSubtitle')"
      retry
      @retry="catalog.ensureTaxonomy(true)"
    />

    <div v-else-if="teachers.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TeacherCard v-for="teacher in teachers" :key="teacher.id" :teacher="teacher" />
    </div>

    <div v-else class="card-surface px-6 py-16 text-center">
      <p class="text-lg font-bold text-ink">{{ $t('teachersEmptyTitle') }}</p>
    </div>
  </div>
</template>
