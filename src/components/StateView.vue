<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  retry?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="card-surface flex flex-col items-center gap-3 px-6 py-12 text-center">
    <span class="grid size-12 place-items-center rounded-full bg-surface-variant text-primary" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
        <path d="M12 8v5" />
        <path d="M12 16.5h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    </span>

    <div>
      <h3 class="text-base font-bold text-ink">{{ title }}</h3>
      <p v-if="subtitle" class="mt-1 text-sm text-muted">{{ subtitle }}</p>
    </div>

    <button
      v-if="retry"
      type="button"
      class="focus-ring rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
      @click="emit('retry')"
    >
      {{ $t('errorRetry') }}
    </button>
  </div>
</template>
