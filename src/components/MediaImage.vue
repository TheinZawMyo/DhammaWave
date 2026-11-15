<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string | null
    alt: string
    loading?: 'lazy' | 'eager'
  }>(),
  { loading: 'lazy' },
)

const failed = ref(false)

watch(
  () => props.src,
  () => {
    failed.value = false
  },
)

const showImage = computed(() => Boolean(props.src) && !failed.value)
</script>

<template>
  <img
    v-if="showImage"
    :src="props.src ?? ''"
    :alt="props.alt"
    :loading="props.loading"
    class="size-full object-cover"
    @error="failed = true"
  />

  <!-- Fallback: the brand mark used in the navbar. -->
  <span v-else class="grid size-full place-items-center bg-surface-variant" aria-hidden="true">
    <span
      class="grid size-1/3 max-h-20 max-w-20 place-items-center rounded-xl bg-primary text-2xl leading-none text-white shadow-sm"
    >
      ☸
    </span>
  </span>
</template>
