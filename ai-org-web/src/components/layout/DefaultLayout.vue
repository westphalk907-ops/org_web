<script setup lang="ts">
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-ink-950">
    <SiteHeader />
    <main class="flex-1 pt-16">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
