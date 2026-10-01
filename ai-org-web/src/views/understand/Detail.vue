<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api, withApiBase, type Content } from '@/api/server'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const article = ref<Content | null>(null)
const loading = ref(false)
const notFound = ref(false)
const renderedHtml = ref('')

async function load() {
  const slug = String(route.params.slug ?? '')
  if (!slug) {
    notFound.value = true
    return
  }
  loading.value = true
  notFound.value = false
  try {
    article.value = await api.getContent(slug)
    renderedHtml.value = renderMarkdown(article.value.content || '')
  } catch (e: any) {
    if (e.code === 'NOT_FOUND') notFound.value = true
    else console.error(e)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, load, { immediate: true })
</script>

<template>
  <article v-if="loading" class="py-20">
    <div class="container-reading text-center text-sm text-ink-200">加载中…</div>
  </article>

  <article v-else-if="notFound" class="py-20">
    <div class="container-reading text-center">
      <div class="text-sm font-mono text-red-400">404</div>
      <h1 class="mt-3 text-display-md font-display font-medium text-ink-50">文章不存在</h1>
      <RouterLink to="/understand/insights" class="mt-8 inline-block text-gold-400 hover:text-gold-300">← 返回洞察列表</RouterLink>
    </div>
  </article>

  <article v-else-if="article" class="py-20">
    <div class="container-reading">
      <!-- 系列面包屑（仅当文章绑定了系列时显示） -->
      <nav v-if="article.series" class="mb-6 flex items-center gap-2 text-sm text-ink-200 flex-wrap">
        <RouterLink to="/understand" class="hover:text-gold-400 transition-colors">认知</RouterLink>
        <span class="text-ink-300">/</span>
        <RouterLink
          :to="`/understand/series/${article.series.slug}`"
          class="hover:text-gold-400 transition-colors"
        >
          {{ article.series.title }}
        </RouterLink>
        <template v-if="article.subTopic">
          <span class="text-ink-300">/</span>
          <span class="text-ink-100">{{ article.subTopic.name }}</span>
        </template>
      </nav>

      <div class="mb-6 text-sm font-mono text-gold-400">
        Understand · {{ article.category }}
      </div>
      <h1 class="text-display-md font-display font-medium text-ink-50 text-balance">
        {{ article.title }}
      </h1>
      <img
        v-if="article.cover"
        :src="withApiBase(article.cover)"
        :alt="article.title"
        class="mt-8 w-full rounded-xl border border-ink-800 object-cover"
        style="max-height: 480px"
      />
      <div class="mt-6 flex items-center gap-4 text-sm text-ink-200">
        <span>{{ article.publishedAt.split('T')[0] }}</span>
        <span class="h-1 w-1 rounded-full bg-ink-700" />
        <span>{{ article.readingTime || 5 }} 分钟阅读</span>
        <span v-if="article.author" class="h-1 w-1 rounded-full bg-ink-700" />
        <span v-if="article.author">{{ article.author }}</span>
      </div>
      <div class="prose prose-invert mt-12 max-w-none" v-html="renderedHtml" />
    </div>
  </article>
</template>
