import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      // '@makerx/forms-core': '@makerx/forms-core/dist/cjs/index.js',
      buffer: 'buffer/',
    },
  },
})
