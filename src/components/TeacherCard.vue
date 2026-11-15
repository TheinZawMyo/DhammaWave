<script setup lang="ts">
import MediaImage from '@/components/MediaImage.vue'
import type { Teacher } from '@/api/types'

defineProps<{
  teacher: Teacher
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'teacher-detail', params: { slug: teacher.slug } }"
    class="focus-ring card-surface group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
  >
    <span class="size-14 shrink-0 overflow-hidden rounded-full bg-surface-variant sm:size-16">
      <MediaImage
        :src="teacher.photo_url"
        :alt="teacher.name"
        class="size-full transition duration-500 group-hover:scale-105"
      />
    </span>

    <span class="min-w-0 flex-1">
      <span class="line-clamp-2 text-base font-bold text-ink transition group-hover:text-primary">
        {{ teacher.name }}
      </span>
      <span v-if="teacher.short_name && teacher.short_name !== teacher.name" class="mt-0.5 block truncate text-sm text-muted">
        {{ teacher.short_name }}
      </span>
    </span>

    <svg
      viewBox="0 0 24 24"
      class="size-5 shrink-0 text-outline transition group-hover:translate-x-0.5 group-hover:text-primary"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </RouterLink>
</template>
