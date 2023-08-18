import react from '@vitejs/plugin-react-swc'
import mdPlugin from 'vite-plugin-markdown'
// import cssPlugin from './css-vite-plugin'
import { defineConfig } from 'vite'
import path from "path";
import million from 'million/compiler';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million.vite(), react(), mdPlugin.default({mode: 'html', markdownIt: {linkify: false}})],
  esbuild: { jsx: 'automatic' },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  ssr: {
    noExternal: ["@mui/**", "@emotion/**", "file-saver"],
  },
})
