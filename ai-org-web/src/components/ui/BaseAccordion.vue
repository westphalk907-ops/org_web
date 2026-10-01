<script setup lang="ts">
interface Props {
  open?: boolean
  title: string
}
defineProps<Props>()
</script>

<template>
  <details class="group border-b border-ink-700 py-6">
    <summary class="flex cursor-pointer items-center justify-between gap-4 list-none">
      <h3 class="text-lg font-medium text-ink-50 group-hover:text-gold-300 transition-colors">
        {{ title }}
      </h3>
      <span class="flex h-8 w-8 items-center justify-center rounded-full border border-gold-700/30 text-gold-400 transition-transform group-open:rotate-45">
        +
      </span>
    </summary>
    <div class="mt-4 text-ink-200 leading-relaxed">
      <slot />
    </div>
  </details>
</template>
