<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  options: Array<{ label: string; value: string }>
  label?: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v)
})
</script>

<template>
  <div>
    <label v-if="label" class="mb-2 block text-sm font-medium text-ink-100">{{ label }}</label>
    <div class="inline-flex rounded-md border border-ink-700 bg-ink-900 p-1">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        class="rounded px-4 py-1.5 text-sm transition-all"
        :class="
          value === opt.value
            ? 'bg-gold-500 text-ink-950 shadow-sm'
            : 'text-ink-100 hover:text-gold-400'
        "
        @click="value = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
