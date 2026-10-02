// Vercel Serverless Function 入口
// 用 createRequire 让 esbuild 不会静态分析 .js 后缀路径
import { createRequire } from 'node:module'
const _require = createRequire(import.meta.url)

async function bootstrap() {
  const tryPaths = [
    '../dist/api/index.js',
    '../dist/index.js',
    '../src/app.js',
    '../src/app.ts',
  ]
  let lastErr: any
  for (const p of tryPaths) {
    try {
      console.log('[bootstrap] trying', p)
      const mod = _require(p)
      const factory = (mod as any).createApp || (mod as any).default
      if (typeof factory === 'function') {
        console.log('[bootstrap] loaded from', p)
        return factory()
      }
    } catch (e: any) {
      console.log('[bootstrap] fail', p, e?.message)
      lastErr = e
    }
  }
  throw lastErr ?? new Error('No app factory found in any try path')
}

export default await bootstrap()
