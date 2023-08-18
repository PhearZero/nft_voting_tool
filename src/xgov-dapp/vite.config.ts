import react from '@vitejs/plugin-react-swc'
import mdPlugin from 'vite-plugin-markdown'
import cssPlugin from './css-vite-plugin'
import { defineConfig } from 'vite'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mdPlugin.default({mode: 'html', markdownIt: {linkify: false}})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
