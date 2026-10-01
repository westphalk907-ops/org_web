<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '../store'
import { api, type Resource } from '@/api/server'
import { ref } from 'vue'

const auth = useAdminAuthStore()
const router = useRouter()

const resources = ref<Resource[]>([])
const loading = ref(false)
const errorMsg = ref('')

async function load() {
  loading.value = true
  try {
    const result = await api.adminListResources({ pageSize: 50 })
    resources.value = result.items
  } catch (e: any) {
    errorMsg.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!auth.user) await auth.fetchMe()
  await load()
})

const totalCount = computed(() => resources.value.length)
const featuredCount = computed(() => resources.value.filter(r => r.isFeatured).length)

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">

      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <div class="text-xs font-mono text-gold-400 tracking-[0.3em] uppercase">
            AI Organization · Admin
          </div>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">
            管理控制台
          </h1>
          <p class="mt-2 text-sm text-ink-200">
            登录身份：{{ auth.user?.username }}（{{ auth.user?.role }}）
          </p>
        </div>
        <button
          type="button"
          class="text-sm text-ink-200 hover:text-gold-300"
          @click="logout"
        >
          退出登录
        </button>
      </div>

      <!-- 统计卡 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="rounded-xl border border-ink-700 bg-ink-900 p-6">
          <div class="text-xs text-ink-200">资料总数</div>
          <div class="mt-2 text-3xl font-display font-medium text-gradient-gold">
            {{ totalCount }}
          </div>
        </div>
        <div class="rounded-xl border border-ink-700 bg-ink-900 p-6">
          <div class="text-xs text-ink-200">精选资源</div>
          <div class="mt-2 text-3xl font-display font-medium text-gradient-gold">
            {{ featuredCount }}
          </div>
        </div>
        <div class="rounded-xl border border-ink-700 bg-ink-900 p-6">
          <div class="text-xs text-ink-200">本周更新</div>
          <div class="mt-2 text-3xl font-display font-medium text-gradient-gold">
            {{ resources.filter(r => new Date(r.publishedAt) > new Date(Date.now() - 7 * 86400000)).length }}
          </div>
        </div>
        <div class="rounded-xl border border-ink-700 bg-ink-900 p-6">
          <div class="text-xs text-ink-200">总下载量</div>
          <div class="mt-2 text-3xl font-display font-medium text-gradient-gold">
            {{ resources.reduce((s, r) => s + r.downloadCount, 0) }}
          </div>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        <RouterLink
          to="/admin/resources"
          class="rounded-xl border border-gold-700/40 bg-gold-500/5 p-6 hover:border-gold-500 hover:bg-gold-500/10 transition-all"
        >
          <div class="text-2xl">📚</div>
          <div class="mt-3 text-lg font-medium text-ink-50">资料管理</div>
          <div class="mt-1 text-xs text-ink-200">白皮书 / Skill / Prompt / 工作流</div>
        </RouterLink>

        <RouterLink
          to="/admin/articles"
          class="rounded-xl border border-gold-700/40 bg-gold-500/5 p-6 hover:border-gold-500 hover:bg-gold-500/10 transition-all"
        >
          <div class="text-2xl">📝</div>
          <div class="mt-3 text-lg font-medium text-ink-50">文章管理</div>
          <div class="mt-1 text-xs text-ink-200">公众号文章 / 深度洞察</div>
        </RouterLink>

        <RouterLink
          to="/admin/cases"
          class="rounded-xl border border-gold-700/40 bg-gold-500/5 p-6 hover:border-gold-500 hover:bg-gold-500/10 transition-all"
        >
          <div class="text-2xl">🏢</div>
          <div class="mt-3 text-lg font-medium text-ink-50">案例管理</div>
          <div class="mt-1 text-xs text-ink-200">客户案例 / Before-After</div>
        </RouterLink>

        <RouterLink
          to="/admin/series"
          class="rounded-xl border border-gold-700/40 bg-gold-500/5 p-6 hover:border-gold-500 hover:bg-gold-500/10 transition-all"
        >
          <div class="text-2xl">📂</div>
          <div class="mt-3 text-lg font-medium text-ink-50">系列管理</div>
          <div class="mt-1 text-xs text-ink-200">认知路径三大节点 / 子主题</div>
        </RouterLink>
      </div>

      <!-- 最近上传 -->
      <div class="rounded-xl border border-ink-700 bg-ink-900 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-medium text-ink-50">最近资源</h2>
          <RouterLink
            to="/admin/resources"
            class="text-sm text-gold-400 hover:text-gold-300"
          >
            全部 →
          </RouterLink>
        </div>

        <div v-if="loading" class="py-8 text-center text-sm text-ink-200">加载中…</div>
        <div v-else-if="errorMsg" class="py-8 text-center text-sm text-red-400">{{ errorMsg }}</div>
        <div v-else class="space-y-2">
          <div
            v-for="r in resources.slice(0, 8)"
            :key="r.id"
            class="flex items-center justify-between py-3 border-b border-ink-800 last:border-0"
          >
            <div class="flex-1 min-w-0">
              <div class="text-sm text-ink-50 truncate">{{ r.title }}</div>
              <div class="text-xs text-ink-200 mt-1">
                {{ r.type }} · {{ r.fileSize || `${r.pages ?? 0} 页` }} · {{ r.publishedAt.split('T')[0] }}
              </div>
            </div>
            <span
              class="ml-4 inline-flex items-center rounded-full px-2 py-0.5 text-xs"
              :class="r.isFeatured ? 'bg-gold-500/20 text-gold-300' : 'bg-ink-800 text-ink-200'"
            >
              {{ r.isFeatured ? '精选' : '普通' }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>