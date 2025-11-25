// import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { homedir } from 'os'

process.env.VITE_BUILD_ID = Date.now()

export default async(mode) => {
  const ENV = loadEnv(mode, __dirname, ['NODE', 'VITE'])
  const PORT = ENV.NODE_LOCALHOST_PORT || 8888
  const BASE = ENV.NODE_PUBLIC_BASE_PATH || '/'
  process.env.VITE_BASE_URL = BASE

  return defineConfig({
    base: BASE,
    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: {
          CallHistory: resolve(__dirname, 'src/CallHistory.js'),
          CallStarter: resolve(__dirname, 'src/CallStarter.js'),
        }
      },
      rollupOptions: {
        external: ['vue', 'pinia', 'vueuse'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
    optimizeDeps: {
      // exclude: ['vue'],
    },
    server: {
      host: ENV.NODE_LOCALHOST_URL,
      port: PORT,
      https: {
        key: ENV.NODE_SSL_KEY_PATH && readFileSync(resolve(ENV.NODE_SSL_KEY_PATH.replace('~', homedir()) || '') || 'key.pem'),
        cert: ENV.NODE_SSL_CER_PATH && readFileSync(resolve(ENV.NODE_SSL_CER_PATH.replace('~', homedir()) || '') || 'cer.pem'),
      },
      proxy: {
        '/webapps': {
          target: ENV.VITE_SWYM_URL,
          changeOrigin: true,
        }
      },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
    resolve: {
      alias: {
        '~/': `${resolve(__dirname, 'src')}/`,
        'vue': 'vue/dist/vue.esm-bundler.js',
        'vuekit': '@ds/vuekit/dist/VUEKIT.js',
        'ky/distribution': resolve(__dirname, 'node_modules/ky/distribution')
      },
    },
    plugins: [
      vue({
        reactivityTransform: true,
      }),
    ]
  })

}
