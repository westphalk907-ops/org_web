<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
      <RouterView v-slot="{ Component, route }">
        <Transition name="page">
          <!--
            使用 route.path 作为 key 而非 fullPath：
            1) 避免仅 hash 变化（如 /#home → /#experience）时整个组件树被销毁重建
            2) 保留页面切换动画，仅在真正的路由切换时触发
          -->
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
  </DefaultLayout>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
