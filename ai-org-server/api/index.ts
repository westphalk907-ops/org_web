// Vercel Serverless Function 入口
// 用 createRequire 让 esbuild 不会静态分析 .js 后缀路径
import { createRequire } from 'node:module'
const _require = createRequire(import.meta.url)
let app: any
try {
  const mod = _require('../dist/api/index.js')
  app = (mod as any).createApp ? (mod as any).createApp() : (mod as any).default
} catch (err) {
  console.error('Failed to bootstrap app from dist/api/index.js:', err)
  throw err
}
export default app
