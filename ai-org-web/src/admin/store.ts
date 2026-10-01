/**
 * 管理后台 - 鉴权 store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/server'

export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'super_admin' | 'admin' | 'editor'
}

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<AdminUser | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string) {
    const result = await api.login(username, password)
    token.value = result.token
    user.value = result.admin as AdminUser
    localStorage.setItem('admin_token', result.token)
  }

  async function fetchMe() {
    if (!token.value) return null
    user.value = (await api.me()) as AdminUser
    return user.value
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
  }

  return { token, user, isLoggedIn, login, fetchMe, logout }
})