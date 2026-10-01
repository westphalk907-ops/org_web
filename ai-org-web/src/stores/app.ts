import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 全局 UI 状态
 */
export const useAppStore = defineStore('app', () => {
  const isNavOpen = ref(false)
  const scrollY = ref(0)
  const theme = ref<'dark'>('dark')

  function openNav() {
    isNavOpen.value = true
  }
  function closeNav() {
    isNavOpen.value = false
  }
  function toggleNav() {
    isNavOpen.value = !isNavOpen.value
  }
  function setScrollY(y: number) {
    scrollY.value = y
  }

  return {
    isNavOpen,
    scrollY,
    theme,
    openNav,
    closeNav,
    toggleNav,
    setScrollY
  }
})
