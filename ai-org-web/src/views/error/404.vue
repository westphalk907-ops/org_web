<script setup lang="ts">
</script>

<template>
  <section class="flex min-h-[80vh] items-center justify-center bg-ink-950">
    <div class="container-wide text-center">
      <div class="font-mono text-xs text-gold-400">404</div>
      <h1 class="mt-4 text-display-lg font-display font-medium">
        页面<br />
        <span class="text-gradient-gold">未找到</span>
      </h1>
      <p class="mt-6 text-base text-ink-200">你访问的页面不存在，或已被移除。</p>
      <div class="mt-10">
        <BaseButton to="/" variant="primary">返回首页</BaseButton>
      </div>
    </div>
  </section>
</template>
