<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '../store'

const auth = useAdminAuthStore()
const router = useRouter()

const username = ref('admin')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function submit() {
  if (!username.value || !password.value) {
    errorMsg.value = '请输入账号和密码'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push('/admin')
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-ink-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="text-xs font-mono text-gold-400 tracking-[0.3em] uppercase">
          AI Organization
        </div>
        <h1 class="mt-2 text-2xl font-display font-medium text-ink-50">管理后台</h1>
        <p class="mt-2 text-sm text-ink-200">文章 / 资源 / 案例</p>
      </div>

      <form
        class="rounded-2xl border border-ink-700 bg-ink-900 p-8 space-y-6"
        @submit.prevent="submit"
      >
        <div>
          <label class="text-xs text-ink-200">账号</label>
          <input
            v-model="username"
            type="text"
            class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-50 focus:border-gold-500 focus:outline-none"
            autocomplete="username"
          />
        </div>

        <div>
          <label class="text-xs text-ink-200">密码</label>
          <input
            v-model="password"
            type="password"
            class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-4 py-3 text-sm text-ink-50 focus:border-gold-500 focus:outline-none"
            autocomplete="current-password"
          />
        </div>

        <div v-if="errorMsg" class="text-sm text-red-400">
          ⚠ {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-gold-500 px-4 py-3 text-sm font-medium text-ink-950 transition-all hover:bg-gold-400 disabled:opacity-50"
        >
          {{ loading ? '登录中…' : '登录' }}
        </button>

        <div class="text-xs text-ink-200 text-center">
          默认账号: admin / admin123456
        </div>
      </form>

      <div class="text-center mt-6">
        <RouterLink to="/" class="text-xs text-ink-200 hover:text-gold-300">
          ← 返回主站
        </RouterLink>
      </div>
    </div>
  </div>
</template>