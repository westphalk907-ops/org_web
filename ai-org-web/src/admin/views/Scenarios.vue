<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { api, type Scenario, type ScenarioCategory, type OwnerContact } from '@/api/server'
import { SCENARIO_CATEGORIES } from '@/data/scenarios'

const items = ref<Scenario[]>([])
const loading = ref(false)
const errorMsg = ref('')
const showDialog = ref(false)
const editing = ref<Scenario | null>(null)
const submitting = ref(false)

// ── Owner Contact ──
const showOwner = ref(false)
const owner = ref<OwnerContact>({ wechatId: '', qrcodeUrl: '', intro: '' })
const ownerSubmitting = ref(false)
const ownerMsg = ref('')

async function load() {
  loading.value = true
  try {
    items.value = await api.adminListScenarios({})
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

function blankScenario(): Scenario {
  return {
    id: '',
    slug: '',
    category: 'INDIVIDUAL' as ScenarioCategory,
    title: '',
    subtitle: '',
    heroDesc: '',
    icon: '✨',
    problem: '',
    beforeSteps: [''],
    afterSteps: [''],
    prompts: [''],
    resourceSlugs: [],
    ownerContactEnabled: true,
    tags: [],
    isActive: true,
    sortOrder: 0,
    publishedAt: new Date().toISOString().slice(0, 10),
  }
}

function openCreate() {
  editing.value = blankScenario()
  showDialog.value = true
}

function openEdit(s: Scenario) {
  const cloned: Scenario = JSON.parse(JSON.stringify(s))
  editing.value = cloned
  // 兼容旧数据：补齐必填字段
  if (editing.value) {
    if (!editing.value.beforeSteps) editing.value.beforeSteps = []
    if (!editing.value.afterSteps) editing.value.afterSteps = []
    if (!editing.value.prompts) editing.value.prompts = []
  }
  showDialog.value = true
}

function addStep(field: 'beforeSteps' | 'afterSteps' | 'prompts') {
  if (!editing.value) return
  editing.value[field].push('')
}

function removeStep(field: 'beforeSteps' | 'afterSteps' | 'prompts', idx: number) {
  if (!editing.value) return
  editing.value[field].splice(idx, 1)
}

function tagsToString(tags: string[]) {
  return tags.join('、')
}
function stringToTags(s: string) {
  return s.split(/[、,]/).map((t) => t.trim()).filter(Boolean)
}

async function save() {
  if (!editing.value) return
  // 校验
  if (!editing.value.slug || !editing.value.title || !editing.value.problem) {
    errorMsg.value = 'Slug / 标题 / 痛点 必填'
    return
  }
  submitting.value = true
  try {
    // 清掉空 step
    const payload: Partial<Scenario> = {
      slug: editing.value.slug,
      category: editing.value.category,
      title: editing.value.title,
      subtitle: editing.value.subtitle,
      heroDesc: editing.value.heroDesc,
      icon: editing.value.icon,
      problem: editing.value.problem,
      beforeSteps: editing.value.beforeSteps.filter((s) => s.trim()),
      afterSteps: editing.value.afterSteps.filter((s) => s.trim()),
      prompts: editing.value.prompts.filter((s) => s.trim()),
      resourceSlugs: editing.value.resourceSlugs,
      ownerContactEnabled: editing.value.ownerContactEnabled,
      tags: editing.value.tags,
      isActive: editing.value.isActive,
      sortOrder: editing.value.sortOrder,
    }
    if (editing.value.id) {
      await api.adminUpdateScenario(editing.value.id, payload)
    } else {
      await api.adminUpsertScenario(payload)
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

async function remove(s: Scenario) {
  if (!confirm(`确定删除「${s.title}」？`)) return
  try {
    await api.adminDeleteScenario(s.id)
    await load()
  } catch (e: any) {
    alert(e.message)
  }
}

async function openOwnerDialog() {
  try {
    owner.value = await api.adminGetOwnerContact()
  } catch {
    owner.value = { wechatId: '', qrcodeUrl: '', intro: '' }
  }
  showOwner.value = true
}

async function saveOwner() {
  if (!owner.value.wechatId.trim()) {
    ownerMsg.value = '微信号必填'
    return
  }
  ownerSubmitting.value = true
  ownerMsg.value = ''
  try {
    await api.adminUpdateOwnerContact(owner.value)
    ownerMsg.value = '保存成功'
    setTimeout(() => (showOwner.value = false), 800)
  } catch (e: any) {
    ownerMsg.value = '⚠ ' + e.message
  } finally {
    ownerSubmitting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="min-h-screen bg-ink-950 pt-24 pb-30">
    <div class="container-wide">
      <div class="flex items-center justify-between mb-8">
        <div>
          <RouterLink to="/admin" class="text-xs text-ink-200 hover:text-gold-300">← 控制台</RouterLink>
          <h1 class="mt-2 text-3xl font-display font-medium text-ink-50">场景管理</h1>
          <p class="mt-1 text-sm text-ink-200">体验区新结构：分类 Tab + 场景详情 + 加微信</p>
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            class="rounded-lg border border-gold-700/40 bg-ink-900 px-5 py-2.5 text-sm text-gold-400 hover:bg-gold-500/10"
            @click="openOwnerDialog"
          >
            ⚙ Owner 微信
          </button>
          <button
            type="button"
            class="rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-400"
            @click="openCreate"
          >
            + 新建场景
          </button>
        </div>
      </div>

      <div v-if="loading" class="py-12 text-center text-sm text-ink-200">加载中…</div>
      <div v-else class="space-y-3">
        <div
          v-for="s in items"
          :key="s.id"
          class="rounded-xl border border-ink-700 bg-ink-900 p-6"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ s.icon || '✨' }}</span>
                <h3 class="text-lg font-medium text-ink-50">{{ s.title }}</h3>
                <span class="rounded-full border border-gold-700/40 px-2 py-0.5 text-xs text-gold-400">
                  {{ SCENARIO_CATEGORIES.find(c => c.value === s.category)?.label }}
                </span>
                <span v-if="!s.isActive" class="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">已停用</span>
              </div>
              <div class="mt-2 text-sm text-ink-200 line-clamp-1">{{ s.problem }}</div>
              <div class="mt-2 text-xs text-ink-200">
                /experience/scenarios/{{ s.slug }} · 排序 {{ s.sortOrder }} ·
                {{ s.beforeSteps.length }} 步传统 → {{ s.afterSteps.length }} 步 AI
              </div>
            </div>
            <div class="flex gap-2">
              <button class="text-xs text-gold-400 hover:text-gold-300 px-3 py-1 rounded border border-gold-700/40" @click="openEdit(s)">编辑</button>
              <button class="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded border border-red-700/40" @click="remove(s)">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 场景编辑: 分组 + 中文说明 + 加大字号 -->
    <div
      v-if="showDialog && editing"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      @click.self="showDialog = false"
    >
      <div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-ink-700 bg-ink-900 p-8">
        <h2 class="text-2xl font-medium text-ink-50">
          {{ editing.id ? '编辑场景' : '新建场景' }}
        </h2>
        <p class="mt-2 text-base text-ink-200">
          体验区场景用于展示「传统做法 vs AI 做法」的对照，按下方分组填写。
        </p>

        <div class="mt-6 space-y-7">

          <!-- 分组 1：基础信息 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">一、基础信息</h3>
            <p class="mt-1 text-sm text-ink-200">设置场景的归类与展示</p>

            <div class="mt-4 grid grid-cols-3 gap-4">
              <div>
                <label class="text-base text-ink-100">URL 路径（Slug） <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">英文短横线</p>
                <input v-model="editing.slug" type="text" placeholder="weekly-report-ai" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
              <div>
                <label class="text-base text-ink-100">分类 <span class="text-red-400">*</span></label>
                <p class="mt-0.5 text-xs text-ink-300">个人 / 团队 / 组织</p>
                <select v-model="editing.category" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50">
                  <option v-for="c in SCENARIO_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
              <div>
                <label class="text-base text-ink-100">图标</label>
                <p class="mt-0.5 text-xs text-ink-300">一个 Emoji 即可</p>
                <input v-model="editing.icon" type="text" placeholder="📝" maxlength="4" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">场景标题 <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">用户看到的场景名称</p>
              <input v-model="editing.title" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">副标题</label>
              <p class="mt-0.5 text-xs text-ink-300">一句话补充说明</p>
              <input v-model="editing.subtitle" type="text" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">痛点 / 场景描述 <span class="text-red-400">*</span></label>
              <p class="mt-0.5 text-xs text-ink-300">这个场景要解决什么问题，2-3 句话即可</p>
              <textarea v-model="editing.problem" rows="3" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
            </div>
          </div>

          <!-- 分组 2：传统 vs AI -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">二、传统 vs AI 步骤对比</h3>
            <p class="mt-1 text-sm text-ink-200">每一步写一句话即可，按顺序排列</p>

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <label class="text-base text-ink-100">传统做法步骤（Before）</label>
                <button type="button" class="text-sm text-gold-400 hover:text-gold-300" @click="addStep('beforeSteps')">+ 添加步骤</button>
              </div>
              <p class="mt-0.5 text-xs text-ink-300">不接 AI 时人是怎么一步步做的</p>
              <div class="mt-2 space-y-2">
                <div v-for="(_, i) in editing.beforeSteps" :key="i" class="flex gap-2">
                  <span class="flex h-10 w-8 shrink-0 items-center justify-center font-mono text-sm text-ink-200">{{ i + 1 }}</span>
                  <input v-model="editing.beforeSteps[i]" type="text" class="flex-1 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
                  <button type="button" class="text-red-400 hover:text-red-300 px-3 text-lg" @click="removeStep('beforeSteps', i)">×</button>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <label class="text-base text-ink-100">AI 做法步骤（After）</label>
                <button type="button" class="text-sm text-gold-400 hover:text-gold-300" @click="addStep('afterSteps')">+ 添加步骤</button>
              </div>
              <p class="mt-0.5 text-xs text-ink-300">接入 AI 后同样的事怎么做</p>
              <div class="mt-2 space-y-2">
                <div v-for="(_, i) in editing.afterSteps" :key="i" class="flex gap-2">
                  <span class="flex h-10 w-8 shrink-0 items-center justify-center font-mono text-sm text-gold-400">{{ i + 1 }}</span>
                  <input v-model="editing.afterSteps[i]" type="text" class="flex-1 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
                  <button type="button" class="text-red-400 hover:text-red-300 px-3 text-lg" @click="removeStep('afterSteps', i)">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分组 3：可复用 Prompt -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">三、可复用 Prompt</h3>
            <p class="mt-1 text-sm text-ink-200">用户可一键复制，用于在自己的 AI 里直接跑</p>

            <div class="mt-4">
              <div class="flex items-center justify-between">
                <label class="text-base text-ink-100">Prompt / Skill 内容</label>
                <button type="button" class="text-sm text-gold-400 hover:text-gold-300" @click="addStep('prompts')">+ 添加 Prompt</button>
              </div>
              <div class="mt-2 space-y-2">
                <div v-for="(_, i) in editing.prompts" :key="i" class="flex gap-2">
                  <textarea v-model="editing.prompts[i]" rows="3" placeholder="例如：你是资深产品经理，请帮我把以下会议纪要整理为周报..." class="flex-1 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 font-mono text-sm text-ink-50"></textarea>
                  <button type="button" class="text-red-400 hover:text-red-300 px-3 text-lg" @click="removeStep('prompts', i)">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 分组 4：关联与开关 -->
          <div>
            <h3 class="text-base font-semibold text-gold-300">四、关联资料与设置</h3>

            <div class="mt-4">
              <label class="text-base text-ink-100">关联资料（Slug 列表）</label>
              <p class="mt-0.5 text-xs text-ink-300">用英文逗号分隔，例如：weekly-report-workflow, meeting-summarizer-skill</p>
              <input
                :value="editing.resourceSlugs.join(',')"
                @change="(e) => editing!.resourceSlugs = ((e.target as HTMLInputElement).value).split(',').map(s => s.trim()).filter(Boolean)"
                type="text"
                placeholder="weekly-report-workflow, meeting-summarizer-skill"
                class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"
              />
            </div>

            <div class="mt-4">
              <label class="text-base text-ink-100">标签</label>
              <p class="mt-0.5 text-xs text-ink-300">用中文顿号、或英文逗号分隔</p>
              <input
                :value="tagsToString(editing.tags)"
                @change="(e) => editing!.tags = stringToTags((e.target as HTMLInputElement).value)"
                type="text"
                placeholder="写作、效率、周报"
                class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"
              />
            </div>

            <div class="mt-4 grid grid-cols-3 gap-4">
              <label class="flex items-center gap-2 text-base text-ink-100">
                <input type="checkbox" v-model="editing.ownerContactEnabled" class="h-4 w-4 rounded" />
                显示加微信按钮
              </label>
              <label class="flex items-center gap-2 text-base text-ink-100">
                <input type="checkbox" v-model="editing.isActive" class="h-4 w-4 rounded" />
                启用此场景
              </label>
              <div>
                <label class="text-base text-ink-100">排序值</label>
                <p class="mt-0.5 text-xs text-ink-300">数字小的靠前</p>
                <input v-model.number="editing.sortOrder" type="number" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
              </div>
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

    <!-- Owner 微信配置 -->
    <div
      v-if="showOwner"
      class="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      @click.self="showOwner = false"
    >
      <div class="w-full max-w-md rounded-2xl border border-ink-700 bg-ink-900 p-8">
        <h2 class="text-2xl font-medium text-ink-50">Owner 微信配置</h2>
        <p class="mt-2 text-base text-ink-200">配置后，体验区每个场景的「加微信」按钮会展示此二维码与微信号。</p>

        <div class="mt-6 space-y-5">
          <div>
            <label class="text-base text-ink-100">微信号 <span class="text-red-400">*</span></label>
            <p class="mt-0.5 text-xs text-ink-300">用户加好友时搜索的 ID</p>
            <input v-model="owner.wechatId" type="text" placeholder="例如：FORGE_Owner" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
          </div>
          <div>
            <label class="text-base text-ink-100">二维码图片 URL</label>
            <p class="mt-0.5 text-xs text-ink-300">例如：/uploads/owner-qr.png</p>
            <input v-model="owner.qrcodeUrl" type="text" placeholder="/uploads/owner-qr.png" class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50" />
          </div>
          <div>
            <label class="text-base text-ink-100">介绍文案</label>
            <p class="mt-0.5 text-xs text-ink-300">加好友时显示的说明，例如：「加好友备注 场景名」</p>
            <textarea v-model="owner.intro" rows="3" placeholder="加好友备注「场景名」..." class="mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-base text-ink-50"></textarea>
          </div>
          <div v-if="ownerMsg" class="text-base" :class="ownerMsg.startsWith('⚠') ? 'text-red-400' : 'text-green-400'">{{ ownerMsg }}</div>
        </div>

        <div class="mt-8 flex justify-end gap-3">
          <button type="button" class="rounded-lg border border-ink-700 bg-ink-950 px-5 py-2.5 text-base text-ink-100 hover:border-ink-600" @click="showOwner = false">取消</button>
          <button type="button" :disabled="ownerSubmitting" class="rounded-lg bg-gold-500 px-5 py-2.5 text-base font-medium text-ink-950 hover:bg-gold-400 disabled:opacity-50" @click="saveOwner">
            {{ ownerSubmitting ? '保存中…' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
