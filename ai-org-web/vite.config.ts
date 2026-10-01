import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import checker from 'vite-plugin-checker'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: { enabled: true }
      }),
      Components({
        dts: 'src/types/components.d.ts',
        dirs: ['src/components/ui', 'src/components/content']
      }),
      checker({
        typescript: true,
        vueTsc: true
      })
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    server: {
      port: 5173,
      strictPort: true,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:18080',
          changeOrigin: true
        }
      }
    },

    build: {
      target: 'es2020',
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            'echarts-vendor': ['echarts', 'vue-echarts'],
            'gsap-vendor': ['gsap'],
            'markdown-vendor': ['marked', 'dompurify']
          }
        }
      },
      chunkSizeWarningLimit: 1500
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },

    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./tests/unit/setup.ts']
    }
  }
})
