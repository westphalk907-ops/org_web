<script setup lang="ts">
// 首页结构：认知 → 让用户找到自己的阶段 → 解释解决方案 → 案例 → 咨询
import HeroSection from '@/components/home/HeroSection.vue'
import EvolutionSection from '@/components/home/EvolutionSection.vue'
import SolutionSection from '@/components/home/SolutionSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import CTASection from '@/components/home/CTASection.vue'
</script>

<template>
  <!-- 单根包裹：Transition 只能包单根节点 -->
  <div class="home-root">
    <HeroSection />       <!-- #home · 制造问题意识 -->
    <EvolutionSection />  <!-- #evolution · 五级进化路径，让用户找到自己的阶段 -->
    <SolutionSection />   <!-- #solution · 人 × 工作 × 组织三角 -->
    <AboutSection />      <!-- #library · AI WORK LIBRARY 货架 → /resources -->
    <CTASection />        <!-- #contact -->
  </div>
</template>
