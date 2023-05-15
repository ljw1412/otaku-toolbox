/* eslint-env node */

import { chrome } from '../../electron-vendors.config.json'
import { join } from 'path'
import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { loadAndSetEnv } from '../../scripts/loadAndSetEnv.mjs'
import { viteExternalsPlugin } from 'vite-plugin-externals'

const PACKAGE_ROOT = __dirname

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd())

const chunksNameMap = {
  '/bilibili-live-ws/': 'bilibili-live-ws',
  '/@ljw1412/ionicons-sprite/': '@ljw1412/ionicons-sprite',
  '/@arco-design/web-vue/': '@arco-design/web-vue',
  '/node_modules/buffer/': 'bilibili-live-ws-utils',
  '/node_modules/events/': 'bilibili-live-ws-utils'
}

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      buffer: 'buffer/index.js',
      events: 'events/events.js',
      vue: 'vue/dist/vue.esm-bundler.js',
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      '/@UI/': join(PACKAGE_ROOT, 'UI') + '/'
    }
  },
  plugins: [vue(), viteExternalsPlugin({ dplayer: 'DPlayer' })],
  base: '',
  server: {
    fsServe: {
      root: join(PACKAGE_ROOT, '../../')
    }
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2
      },
      safari10: false
    },
    rollupOptions: {
      external: [
        // ...builtinModules
        ...(() => {
          // 不排除 bilibili-live-ws 使用的 'buffer', 'events'
          const list = []
          for (const name of builtinModules) {
            if (['buffer', 'events'].includes(name)) continue
            list.push(name)
          }
          return list
        })()
      ],
      output: {
        manualChunks(id) {
          for (const key of Object.keys(chunksNameMap)) {
            if (id.includes(key)) {
              return chunksNameMap[key]
            }
          }
        }
      }
    },
    emptyOutDir: true
  }
})
