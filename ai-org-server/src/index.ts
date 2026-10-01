import { createApp } from './app.js'
import { config } from './config/index.js'

const app = createApp()

app.listen(config.port, () => {
  console.log('')
  console.log('═'.repeat(60))
  console.log(`  🚀 AI Organization Server`)
  console.log(`  📍 http://localhost:${config.port}/api/health`)
  console.log(`  🌍 Env: ${config.env}`)
  console.log(`  💾 DB: ${config.db.url.replace(/:[^:@]+@/, ':***@')}`)
  console.log('═'.repeat(60))
  console.log('')
})
