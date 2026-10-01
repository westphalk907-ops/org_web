<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type CaseStudy } from '@/api/server'

const items = ref<CaseStudy[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showDialog = ref(false)
const editing = ref<CaseStudy | null>(null)
const submitting = ref(false)

async function load() {
  loading.value = true
  try {
    const result = await api.adminListCases({ pageSize: 100 })
    items.value = result.items
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(load)

function openCreate() {
  editing.value = {
    id: '',
    slug: '',
    company: '',
    industry: '',
    scale: '',
    title: '',
    before: '',
    intervention: '',
    after: '',
    next: '',
    isPublished: true,
    sortOrder: 0,
  } as CaseStudy
  showDialog.value = true
}

function openEdit(c: CaseStudy) {
  editing.value = JSON.parse(JSON.stringify(c))
  showDialog.value = true
}

async function save() {
  if (!editing.value) return
  submitting.value = true
  try {
    const e = editing.value
    const payload: Partial<CaseStudy> = {
      slug: e.slug,
      company: e.company,
      industry: e.industry,
      scale: e.scale,
      title: e.title,
      before: e.before,
      intervention: e.intervention,
      after: e.after,
      next: e.next,
      metrics: e.metrics,
      testimonial: e.testimonial,
      isPublished: e.isPublished,
      sortOrder: e.sortOrder,
    }
    if (e.id) {
      await api.adminUpdateCase(e.id, payload)
    } else {
      await api.adminCreateCase(payload)
    }
    showDialog.value = false
    editing.value = null
    await load()
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    submitting.value = false
  }
}

async function remove(c: CaseStudy) {
  if (!confirm(`确定删除「${c.title}」？`)) return
  try {
    await api.adminDeleteCase(c.id)
    await load()
  } catch (e: any) {
    alert(e.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">
      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink to="/admin" class="text-xs text-ink-200 hover:text-gold-300">← 控制台</RouterLink>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">案例管理</h1>
        </div>
        <button
          type="button"
          class="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400"
          @click="openCreate"
        >
          + 新建案例
        </button>
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>

      <div v-else class="space-y-3">
        <div
          v-for="c in items"
          :key="c.id"
          class="rounded-xl border border-ink-700 bg-ink-900 p-6"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-medium text-ink-50">{{ c.title }}</h3>
              <div class="mt-1 text-sm text-ink-200">{{ c.company }} · {{ c.industry }} · {{ c.scale }}</div>
              <div class="mt-2 text-xs text-ink-200">/{{ c.slug }}</div>
            </div>
            <div class="flex gap-2">
              <button class="text-xs text-gold-400 hover:text-gold-300 px-3 py-1 rounded border border-gold-700/40" @click="openEdit(c)">编辑</button>
              <button class="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded border border-red-700/40" @click="remove(c)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹层: 分组 + 中文说明 + 加大字号 -->
    <div
      v-if="showDialog && editing"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      @click.self="showDialog = false"
    >
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-8">
        <h2 class="text-2xl font-medium text-ink-50">
          {{ editing.id ? '编辑案例' : '新建案例' }}
        </h2>
        <p class="mt-2 text-base text-ink-200">
          案例用于案例库页面展示企业实践，按「传统做法 → 道可乾元介入 → 改进效果 → 下一步」四段结构填写。
        </p>

        <div class="mt-6 space-y-7">

          <!-- 分组 1：基础信息 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">一、企业基础信息</h3>
            <p class="mt-1 text-sm text-ink-200">用于案例卡片上的展示</p>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">URL 路径（Slug） <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">例如：saas-org-upgrade</p>
                <input v-model="editing.slug" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
              <div>
                <label class="text-base text-ink-100">行业 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">例如：制造业、零售、金融</p>
                <input v-model="editing.industry" type="text" placeholder="例如：制造业" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label class="text-base text-ink-100">公司名称 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">真实名称或脱敏后名称</p>
                <input v-model="editing.company" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
              <div>
                <label class="text-base text-ink-100">企业规模</label>
                <p class="mt-0.5 text-xs text-ink-300">例如：10,000+ 员工 / 500 人</p>
                <input v-model="editing.scale" type="text" placeholder="例如：10,000+ 员工" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">案例标题 <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">一句话点题，例如：「从 5 人 AI 试验到 200 人 AI 组织」</p>
              <input v-model="editing.title" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
            </div>
          </div>

          <!-- 分组 2：故事四段 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">二、案例故事（Before / Intervention / After / Next）</h3>
            <p class="mt-1 text-sm text-ink-200">按四段式结构组织，案例详情页会按照这个顺序展示</p>

            <div class="mt-4">
              <label class="text-base text-ink-100">① 传统做法（Before）</label>
              <p class="mt-0.5 text-xs text-ink-300">客户在没有 AI 介入前是怎么做的，描述痛点和低效</p>
              <textarea v-model="editing.before" rows="3" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
            </div>
            <div class="mt-4">
              <label class="text-base text-ink-100">② 道可乾元介入（Intervention）</label>
              <p class="mt-0.5 text-xs text-ink-300">我们提供了什么培训 / 项目 / 咨询服务，描述关键动作</p>
              <textarea v-model="editing.intervention" rows="3" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
            </div>
            <div class="mt-4">
              <label class="text-base text-ink-100">③ 改进效果（After）</label>
              <p class="mt-0.5 text-xs text-ink-300">具体的、可量化的效果最好；没有数据也可以写质性结果</p>
              <textarea v-model="editing.after" rows="3" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
            </div>
            <div class="mt-4">
              <label class="text-base text-ink-100">④ 下一步（Next）</label>
              <p class="mt-0.5 text-xs text-ink-300">客户后续打算如何继续推进 AI 组织进化</p>
              <textarea v-model="editing.next" rows="2" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
            </div>
          </div>

          <div v-if="errorMsg" class="text-base text-red-400">⚠ {{ errorMsg }}</div>
        </div>

        <div class="mt-8 flex justify-end gap-3">
          <button type="button" class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-ink-600" @click="showDialog = false">取消</button>
          <button type="button" :disabled="submitting" class="rounded-lg bg-gold-500 px-5 py-2.5 text-base font-medium text-ink-950 hover:bg-gold-400 disabled:opacity-50" @click="save">
            {{ submitting ? '保存中…' : '保存' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>