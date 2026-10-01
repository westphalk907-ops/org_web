import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 加载根目录 .env
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) {console.error(`⚠️  Missing required env var: ${name}`);
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function asInt(name: string, fallback: number): number {
  const v = process.env[name]
  if (!v) return fallback
  const n = parseInt(v, 10)
  if (Number.isNaN(n)) throw new Error(`Env ${name} must be integer, got: ${v}`)
  return n
}

function asList(name: string, fallback: string[] = []): string[] {
  const v = process.env[name]
  if (!v) return fallback
  return v.split(',').map((s) => s.trim()).filter(Boolean)
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  port: asInt('PORT', 4000),

  db: {
    url: required('DATABASE_URL'),
  },

  jwt: {
    secret: required('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  upload: {
    /** 普通资料文件（PDF/Word/MD/ZIP）单文件最大 MB
     *
     * ⚠️ 此值必须与前端 src/constants/upload.ts 的 MAX_FILE_SIZE_MB
     *    以及 .env VITE_MAX_FILE_SIZE_MB 保持一致
     */
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSizeMB: asInt('MAX_FILE_SIZE_MB', 20),
  },

  cors: {
    origins: asList('CORS_ORIGINS', ['http://localhost:5173']),
  },

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    email: process.env.ADMIN_EMAIL || 'admin@ai-org.local',
  },
} as const

export type AppConfig = typeof config
