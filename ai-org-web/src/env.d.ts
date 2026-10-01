/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_EMAIL_API_KEY?: string
  readonly VITE_CMS_API_URL?: string
  readonly VITE_CMS_API_KEY?: string
  /** 普通资料文件（PDF/Word/MD/ZIP）单文件最大 MB；默认 20，必须与后端 MAX_FILE_SIZE_MB 一致 */
  readonly VITE_MAX_FILE_SIZE_MB?: string
  /** 图片文件（封面/正文配图）单文件最大 MB；默认 8，必须与后端 IMAGE_MAX_BYTES 一致 */
  readonly VITE_MAX_IMAGE_SIZE_MB?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
