import { createApp } from './app.js'
import { config } from './config/index.js'

const app = createApp()

// Railway 必须监听 0.0.0.0，不能只监听 localhost！
app.listen(config.port, '0.0.0.0', () => {
  console.log('')
  console.log('═'.repeat(60))
  console.log(`  🚀 AI Organization Server`)
  console.log(`  📍 Listening on 0.0.0.0:${config.port}`)
  console.log(`  🌍 Env: ${config.env}`)
  console.log(`  💾 DB: ${config.db.url.replace(/:[^:@]+@/, ':***@')}`)
  console.log(`  🏥 Health: /api/health`)
  console.log('═'.repeat(60))
  console.log('')
})
