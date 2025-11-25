import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
// import { readFileSync } from 'fs';
// import { resolve } from 'path';
import { version } from './package.json';
// import { homedir } from 'os';
import vue from '@vitejs/plugin-vue';

process.env.VITE_BUILD_ID = Date.now();

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['NODE', 'VITE']);
  const port = env.NODE_LOCALHOST_PORT || 8888;
  const baseUrl = env.NODE_PUBLIC_BASE_PATH || '/';
  // const host = env.NODE_LOCALHOST_URL;
  process.env.VITE_BASE_URL = baseUrl;
  return {
    test: {
      environment: 'jsdom',
    },
    // define: process.env.VITEST ? {} : { global: 'window' },
    base: baseUrl,
    build: {
      lib: {
        //
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
    server: {
      // host: host,
      port: port,
      // https: {
      //   key:
      //     env.NODE_SSL_KEY_PATH &&
      //     readFileSync(resolve(env.NODE_SSL_KEY_PATH.replace('~', homedir()) || '') || 'key.pem'),
      //   cert:
      //     env.NODE_SSL_CER_PATH &&
      //     readFileSync(resolve(env.NODE_SSL_CER_PATH.replace('~', homedir()) || '') || 'cer.pem'),
      // },
      // proxy: {
      //   '/webapps': {
      //     target: env.VITE_SWYM_URL,
      //     changeOrigin: true,
      //   },
      // },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..'],
      },
    },
    plugins: [vue({ reactivityTransform: true })],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
        'vue': 'vue/dist/vue.esm-bundler.js',
        'vuekit': '@ds/vuekit/dist/VUEKIT.umd.cjs',
      },
    },
    define: {
      _NODE_VITE_ENV_: env,
      _VERSION_: JSON.stringify(version),
    },
  };
});
