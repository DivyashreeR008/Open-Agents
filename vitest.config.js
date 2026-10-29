import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/test/**', 'src/**/*.{test,spec}.{js,jsx}'],
      reporter: ['text-summary', 'text', 'html', 'json-summary'],
      // Non-regression floor, set a few points below the baseline measured
      // when coverage was introduced (statements 51%, branches 34%,
      // functions 59%, lines 45%). Raise these as tests are added.
      thresholds: {
        statements: 48,
        branches: 31,
        functions: 55,
        lines: 42,
      },
    },
  },
})
