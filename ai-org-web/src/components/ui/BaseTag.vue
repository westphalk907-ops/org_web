<script setup lang="ts">
interface Props {
  variant?: 'default' | 'gold'
}
withDefaults(defineProps<Props>(), { variant: 'default' })
</script>

<template>
  <span :class="variant === 'gold' ? 'tag-gold' : 'tag'">
    <slot />
  </span>
</template>
