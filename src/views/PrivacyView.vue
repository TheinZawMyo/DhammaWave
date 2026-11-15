<script setup lang="ts">
const sections = [
  { title: 'privacyDataTitle', body: 'privacyDataBody' },
  { title: 'privacyLocalTitle', body: 'privacyLocalBody' },
  { title: 'privacyNetworkTitle', body: 'privacyNetworkBody' },
  { title: 'privacySharingTitle', body: 'privacySharingBody' },
  { title: 'privacyChildrenTitle', body: 'privacyChildrenBody' },
  { title: 'privacyChangesTitle', body: 'privacyChangesBody' },
  { title: 'privacyContactTitle', body: 'privacyContactBody' },
] as const
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
    <header class="mb-10">
      <h1 class="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {{ $t('privacyTitle') }}
      </h1>
      <p class="mt-2 text-sm text-muted">{{ $t('privacyLastUpdated') }}</p>
    </header>

    <div class="card-surface p-6 sm:p-8">
      <p class="leading-relaxed text-ink/85">{{ $t('privacyIntro') }}</p>

      <div class="mt-8 space-y-8">
        <section v-for="section in sections" :key="section.title">
          <h2 class="text-lg font-extrabold text-ink">{{ $t(section.title) }}</h2>
          <p class="mt-2 leading-relaxed text-ink/80">{{ $t(section.body) }}</p>
        </section>
      </div>
    </div>
  </div>
</template>
