<script setup lang="ts">
import { onMounted, ref } from 'vue'
import QRCode from 'qrcode'

const props = withDefaults(
  defineProps<{
    value: string
    size?: number
  }>(),
  { size: 200 },
)

const canvas = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)

onMounted(async () => {
  if (!canvas.value || !props.value) return

  try {
    await QRCode.toCanvas(canvas.value, props.value, {
      width: props.size,
      margin: 1,
      color: {
        dark: '#70401f',
        light: '#fffdf8',
      },
      errorCorrectionLevel: 'M',
    })
  } catch {
    failed.value = true
  }
})
</script>

<template>
  <div class="inline-block">
    <canvas
      v-show="!failed"
      ref="canvas"
      class="rounded-xl border border-outline bg-surface"
      :width="size"
      :height="size"
      role="img"
      :aria-label="$t('downloadQrAlt')"
    />
    <p v-if="failed" class="text-sm text-muted">{{ value }}</p>
  </div>
</template>
