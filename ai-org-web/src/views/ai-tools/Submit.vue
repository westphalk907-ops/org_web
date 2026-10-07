<template>
  <div class="submit-page">
      <h1>📤 提交 AI 工具</h1>
      <p class="subtitle">你发现了好用的 AI 工具？提交给我们，审核通过后会展示在导航站</p>

      <form @submit.prevent="handleSubmit" class="submit-form">
        <div class="form-group">
          <label>工具名称 <span class="required">*</span></label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="50"
            placeholder="例如：ChatGPT"
          />
        </div>

        <div class="form-group">
          <label>官方网址 <span class="required">*</span></label>
          <input
            v-model="form.url"
            type="url"
            required
            placeholder="https://..."
          />
        </div>

        <div class="form-group">
          <label>分类 <span class="required">*</span></label>
          <select v-model="form.category" required>
            <option value="">请选择分类</option>
            <option v-for="cat in categories" :key="cat.key" :value="cat.key">
              {{ cat.emoji }} {{ cat.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>工具简介 <span class="required">*</span></label>
          <textarea
            v-model="form.description"
            required
            maxlength="200"
            placeholder="一句话介绍这个工具（不超过 200 字）"
            rows="3"
          ></textarea>
          <span class="counter">{{ form.description.length }}/200</span>
        </div>

        <div class="form-group">
          <label>推荐理由</label>
          <textarea
            v-model="form.reason"
            maxlength="500"
            placeholder="为什么推荐这个工具？有什么特色？（选填）"
            rows="4"
          ></textarea>
          <span class="counter">{{ form.reason.length }}/500</span>
        </div>

        <div class="form-group">
          <label>联系邮箱（选填）</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="方便我们审核后通知你"
          />
          <span class="hint">仅用于通知审核结果，不会用于其他用途</span>
        </div>

        <button type="submit" :disabled="submitting" class="btn-submit">
          {{ submitting ? '提交中...' : '提交' }}
        </button>

        <div v-if="message" class="message" :class="messageType">
          {{ message }}
        </div>
      </form>

      <AiToolsDisclaimer />
    </div>
</template>

<script setup lang="ts">
// useHead not available in this Vue setup - title handled by router meta
import { ref, onMounted } from 'vue'
import AiToolsDisclaimer from '@/components/ai-tools/AiToolsDisclaimer.vue'
import { api } from '@/api/server'

const form = ref({
  name: '',
  url: '',
  category: '',
  description: '',
  reason: '',
  email: '',
})

const categories = ref<Array<{ key: string; label: string; emoji: string }>>([])
const submitting = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

onMounted(async () => {
  try {
    categories.value = await api.listAiToolCategories()
  } catch (err) {
    console.error(err)
  }
})

async function handleSubmit() {
  submitting.value = true
  message.value = ''
  messageType.value = 'success'

  try {
    const res = await api.submitAiTool({
      name: form.value.name.trim(),
      url: form.value.url.trim(),
      category: form.value.category,
      description: form.value.description.trim(),
      reason: form.value.reason.trim() || undefined,
      email: form.value.email.trim() || undefined,
    })
    message.value = res.message || '提交成功！我们会在 1-3 个工作日内审核。'
    messageType.value = 'success'
    form.value = { name: '', url: '', category: '', description: '', reason: '', email: '' }
  } catch (err: any) {
    message.value = err?.message || '提交失败，请重试'
    messageType.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.submit-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  margin: 0 0 32px;
  font-size: 15px;
}

.submit-form {
  background: white;
  padding: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1e293b;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.counter {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.hint {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
}

.message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
</style>