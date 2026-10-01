<script setup lang="ts">
interface Props {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}
withDefaults(defineProps<Props>(), { align: 'left' })
</script>

<template>
  <div :class="['mb-12', align === 'center' ? 'text-center' : 'text-left']">
    <div v-if="eyebrow" class="section-eyebrow">
      <span class="inline-block h-px w-8 bg-gold-500" />
      {{ eyebrow }}
    </div>
    <h2 class="section-title text-balance">{{ title }}</h2>
    <p v-if="description" class="mt-4 max-w-2xl text-lg text-ink-200 text-balance" :class="{ 'mx-auto': align === 'center' }">
      {{ description }}
    </p>
  </div>
</template>
