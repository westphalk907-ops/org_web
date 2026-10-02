// Vercel Serverless Function 入口（最简版）
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const mod = require('../dist/api/index.js')
const factory = mod.createApp || mod.default
export default factory()
