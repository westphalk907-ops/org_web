import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config/index.js'
import { errorMiddleware, notFoundMiddleware } from './middleware/error.js'
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

  // ⚠️ Vercel Serverless 不支持本地静态文件服务（无持久磁盘）
  // 静态资源全部走 Vercel Blob / CDN
  // 本地开发时设置 ENABLE_LOCAL_STATIC=1 可启用本地静态服务

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
  // seriesAdminRoutes 必须在 seriesRoutes 之前 mount
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