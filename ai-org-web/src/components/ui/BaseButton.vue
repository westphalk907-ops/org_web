<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  block?: boolean
  /**
   * href 是否为外部链接（默认 true，自动加 target="_blank" rel="noopener"）
   * 当 href 为站内 hash（如 "#home"）或站内路径（如 "/about"）时，传 false
   */
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  external: true
})

const sizeClasses = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg'
}

const variantClasses = {
  primary:
    'bg-gold-500 text-ink-950 hover:bg-gold-400 hover:shadow-gold-glow active:scale-[0.98]',
  secondary:
    'border border-gold-500/40 text-gold-300 hover:border-gold-400 hover:bg-gold-500/5 hover:text-gold-200 active:scale-[0.98]',
  ghost:
    'text-ink-100 hover:text-gold-400'
}

// to 的类型推断：'/xxx' 是站内，'https://...' 是外链
const isExternalTo = computed(() => !!props.to && props.to.startsWith('http'))
</script>

<template>
  <RouterLink
    v-if="to && !isExternalTo"
    :to="to"
    class="btn-base"
    :class="[sizeClasses[props.size], variantClasses[props.variant], { 'w-full': block }]"
  >
    <slot />
  </RouterLink>
  <a
    v-else-if="to"
    :href="to"
    target="_blank"
    rel="noopener"
    class="btn-base"
    :class="[sizeClasses[props.size], variantClasses[props.variant], { 'w-full': block }]"
  >
    <slot />
  </a>
  <a
    v-else-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    class="btn-base"
    :class="[sizeClasses[props.size], variantClasses[props.variant], { 'w-full': block }]"
  >
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="btn-base"
    :class="[sizeClasses[props.size], variantClasses[props.variant], { 'w-full': block }]"
  >
    <slot />
  </button>
</template>
