import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'node:path'
import { config } from './config/index.js'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.js'
import { ok } from './utils/response.js'
import authRoutes from './routes/auth.routes.js'
import resourceRoutes from './routes/resource.routes.js'
import contentRoutes from './routes/content.routes.js'
import caseRoutes from './routes/case.routes.js'
import homeConfigRoutes from './routes/homeConfig.routes.js'
import experienceRoutes from './routes/experience.routes.js'
import scenarioRoutes from './routes/scenario.routes.js'
import seriesRoutes from './routes/series.routes.js'
import seriesAdminRoutes from './routes/series.admin.routes.js'

export function createApp(): Express {
  const app = express()

  // 安全头 + CORS
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
  app.use(
    cors({
      origin: config.cors.origins.length === 1 ? config.cors.origins[0] : config.cors.origins,
      credentials: true,
    })
  )

  // body 解析
  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: true, limit: '5mb' }))

  // 静态文件：uploads/
  app.use(
    '/uploads',
    express.static(path.resolve(process.cwd(), config.upload.dir), {
      maxAge: '7d',
      etag: true,
    })
  )

  // 健康检查 - 不依赖 DB，确保 Railway 能检测到服务
  app.get('/api/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      env: config.env,
      time: new Date().toISOString(),
      version: '1.0.0',
    })
  })

  // 业务路由
  app.use('/api/auth', authRoutes)
  app.use('/api/resources', resourceRoutes)
  app.use('/api/contents', contentRoutes)
  // seriesAdminRoutes 必须在 seriesRoutes 之前 mount，
  // 否则 /api/series/admin/* 会被 /:slug 路由匹配掉
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
