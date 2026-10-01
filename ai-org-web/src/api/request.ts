import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import NProgress from 'nprogress'

NProgress.configure?.({ showSpinner: false })

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  withCredentials: false
})

service.interceptors.request.use(
  (config) => {
    NProgress.start?.()
    return config
  },
  (error) => {
    NProgress.done?.()
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    NProgress.done?.()
    return response.data
  },
  (error) => {
    NProgress.done?.()
    return Promise.reject(error)
  }
)

export async function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return (await service.request(config)) as T
}

export default service
