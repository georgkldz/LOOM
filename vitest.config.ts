/// <reference types="vitest" />
import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import path from 'node:path'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // nur für Option B – bei echter Quasar-Installation weglassen
        quasar: path.resolve(__dirname, 'tests/__mocks__/quasar.ts')
      }
    },
    test: {
      environment: 'jsdom',                       // bleibt wie gehabt :contentReference[oaicite:4]{index=4}
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/**',],
      root: fileURLToPath(new URL('./', import.meta.url)),
      setupFiles: ['./tests/setup-vitest.ts'],
      coverage: {                                 // v8-Provider ist default und am schnellsten :contentReference[oaicite:5]{index=5}
        provider: 'v8',
        reporter: ['text', 'html'],
        include: ['src/**/*.{vue,ts}']
      }
    }
  })
)
