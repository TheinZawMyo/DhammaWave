import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { api } from '@/api/client'
import type { Audio } from '@/api/types'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2] as const

export const usePlayerStore = defineStore('player', () => {
  const current = ref<Audio | null>(null)
  const queue = ref<Audio[]>([])
  const isPlaying = ref(false)
  const isLoading = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const speed = ref(1)
  const error = ref<string | null>(null)

  let element: HTMLAudioElement | null = null
  let resolvedSlug: string | null = null
  let resolvedUrl: string | null = null

  function ensureElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null

    if (!element) {
      element = new Audio()
      element.preload = 'metadata'
      element.addEventListener('timeupdate', syncTime)
      element.addEventListener('durationchange', syncDuration)
      element.addEventListener('play', () => (isPlaying.value = true))
      element.addEventListener('pause', () => (isPlaying.value = false))
      element.addEventListener('ended', handleEnded)
      element.addEventListener('error', handleError)
    }

    return element
  }

  function syncTime(): void {
    if (element) currentTime.value = element.currentTime
  }

  function syncDuration(): void {
    if (element && Number.isFinite(element.duration)) {
      duration.value = element.duration
    }
  }

  function handleEnded(): void {
    playNext()
  }

  function handleError(): void {
    error.value = 'playerErrorSource'
    isPlaying.value = false
  }

  /**
   * Signed stream URLs have a short TTL, so resolve a fresh one before playing.
   */
  async function resolveUrl(audio: Audio): Promise<string | null> {
    if (resolvedSlug === audio.slug && resolvedUrl) {
      return resolvedUrl
    }

    try {
      const response = await api.playbackUrl(audio.slug)

      if (response.data.playback_url) {
        resolvedSlug = audio.slug
        resolvedUrl = response.data.playback_url
        return resolvedSlug ? resolvedUrl : null
      }
    } catch {
      // Fall back to the URL that came with the listing payload.
    }

    resolvedSlug = audio.slug
    resolvedUrl = audio.playback_url
    return resolvedUrl
  }

  async function play(audio: Audio, list?: Audio[]): Promise<void> {
    const player = ensureElement()

    if (!player) return

    if (list && list.length > 0) {
      queue.value = list
    } else if (!queue.value.some((item) => item.slug === audio.slug)) {
      queue.value = [audio, ...queue.value]
    }

    error.value = null

    if (current.value?.slug === audio.slug && resolvedUrl) {
      if (player.paused) {
        await player.play().catch(() => {
          error.value = 'playerErrorGeneric'
        })
      } else {
        player.pause()
      }
      return
    }

    current.value = audio
    isLoading.value = true
    currentTime.value = 0
    duration.value = audio.duration_seconds

    const url = await resolveUrl(audio)

    isLoading.value = false

    if (!url) {
      error.value = 'playerErrorSource'
      return
    }

    player.src = url
    player.playbackRate = speed.value

    try {
      await player.play()
    } catch {
      error.value = 'playerErrorGeneric'
    }
  }

  function toggle(): void {
    const player = element

    if (!player || !current.value) return

    if (player.paused) {
      void player.play().catch(() => {
        error.value = 'playerErrorGeneric'
      })
    } else {
      player.pause()
    }
  }

  function pause(): void {
    element?.pause()
  }

  function stop(): void {
    const player = element

    if (!player) return

    player.pause()
    player.removeAttribute('src')
    player.load()
    current.value = null
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    resolvedSlug = null
    resolvedUrl = null
  }

  function seek(seconds: number): void {
    if (!element) return

    const target = Math.min(Math.max(0, seconds), element.duration || seconds)
    element.currentTime = target
    currentTime.value = target
  }

  function skip(delta: number): void {
    if (!element) return

    seek(element.currentTime + delta)
  }

  function setSpeed(value: number): void {
    speed.value = value

    if (element) {
      element.playbackRate = value
    }
  }

  function playNext(): void {
    if (queue.value.length === 0) return

    const index = current.value ? queue.value.findIndex((item) => item.slug === current.value?.slug) : -1
    const next = queue.value[index + 1]

    if (!next) {
      pause()
      return
    }

    void play(next)
  }

  function playPrevious(): void {
    if (!current.value) return

    const index = queue.value.findIndex((item) => item.slug === current.value?.slug)

    if (index <= 0) {
      seek(0)
      return
    }

    const previous = queue.value[index - 1]

    if (previous) {
      void play(previous)
    }
  }

  const progress = computed(() => {
    if (!duration.value) return 0
    return Math.min(100, (currentTime.value / duration.value) * 100)
  })

  const hasNext = computed(() => {
    if (!current.value) return false
    const index = queue.value.findIndex((item) => item.slug === current.value?.slug)
    return index >= 0 && index < queue.value.length - 1
  })

  const hasPrevious = computed(() => {
    if (!current.value) return false
    const index = queue.value.findIndex((item) => item.slug === current.value?.slug)
    return index > 0
  })

  return {
    current,
    queue,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    speed,
    error,
    progress,
    hasNext,
    hasPrevious,
    speeds: SPEEDS,
    play,
    toggle,
    pause,
    stop,
    seek,
    skip,
    setSpeed,
    playNext,
    playPrevious,
  }
})
