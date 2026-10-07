// Vercel Serverless Function 入口
// 必须包含完整代码，因为 Vercel 会编译这个文件
// 不依赖 ../src 或 ../dist（避免双重构建冲突）
import express, { type Express, type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { config } from '../src/config/index.js'
import { errorMiddleware, notFoundMiddleware } from '../src/middleware/error.js'
import authRoutes from '../src/routes/auth.routes.js'
import resourceRoutes from '../src/routes/resource.routes.js'
import contentRoutes from '../src/routes/content.routes.js'
import caseRoutes from '../src/routes/case.routes.js'
import homeConfigRoutes from '../src/routes/homeConfig.routes.js'
import experienceRoutes from '../src/routes/experience.routes.js'
import scenarioRoutes from '../src/routes/scenario.routes.js'
import seriesRoutes from '../src/routes/series.routes.js'
import seriesAdminRoutes from '../src/routes/series.admin.routes.js'

export function createApp(): Express {
  const app = express()

  // 安全头（替代 helmet，避免 Vercel Serverless 环境的 jsdom/ESM 冲突）
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '0')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    res.removeHeader('X-Powered-By')
    next()
  })
  app.use(
    cors({
      origin: config.cors.origins.length === 1 ? config.cors.origins[0] : config.cors.origins,
      credentials: true,
    })
  )

  // body 解析
  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: true, limit: '5mb' }))

  // 健康检查
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      env: config.env,
      vercel: process.env.VERCEL === '1',
      time: new Date().toISOString(),
      version: '1.0.0',
    })
  })

  // 业务路由
  app.use('/api/auth', authRoutes)
  app.use('/api/resources', resourceRoutes)
  app.use('/api/contents', contentRoutes)
  app.use('/api/series', seriesAdminRoutes)
  app.use('/api/series', seriesRoutes)
  app.use('/api/cases', caseRoutes)
  app.use('/api/home-config', homeConfigRoutes)
  app.use('/api/experience', experienceRoutes)
  app.use('/api', scenarioRoutes)

  // 404 + error
  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}

// Vercel Serverless: 直接 export Express app
const app = createApp()
export default app