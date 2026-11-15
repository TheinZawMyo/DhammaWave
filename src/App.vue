<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import PlayerBar from '@/components/PlayerBar.vue'
import { useCatalogStore } from '@/stores/catalog'

const route = useRoute()
const catalog = useCatalogStore()
const { t, locale } = useI18n()

const pageTitle = computed(() => {
  const key = route.meta.titleKey as string | undefined
  return key ? t(key) : 'DhammaWave'
})

function syncTitle(): void {
  document.title = `${pageTitle.value} · DhammaWave`
}

onMounted(() => {
  void catalog.ensureHome()
  syncTitle()
})

watch(pageTitle, syncTitle)
watch(locale, syncTitle)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background">
    <a
      href="#main"
      class="focus-ring sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to content
    </a>

    <AppHeader />

    <main id="main" class="flex-1 pb-28">
      <RouterView v-slot="{ Component }">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter />
    <PlayerBar />
  </div>
</template>
