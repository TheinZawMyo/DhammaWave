<template>
  <div class="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
    <span class="grid size-16 place-items-center rounded-2xl bg-primary-container text-3xl text-primary-dark" aria-hidden="true">
      ☸
    </span>

    <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-ink">
      {{ $t('errorNotFoundTitle') }}
    </h1>

    <p class="mt-3 text-muted">{{ $t('errorNotFoundBody') }}</p>

    <RouterLink
      :to="{ name: 'home' }"
      class="focus-ring mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
    >
      {{ $t('errorBackHome') }}
    </RouterLink>
  </div>
</template>
