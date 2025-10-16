import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  css: {
    preprocessorOptions: {
      sass: {
        quietDeps: true, // 静默依赖包的警告
        silenceDeprecations: ['slash-div'], // 忽略除法警告
      },
      scss: {
        quietDeps: true,
        silenceDeprecations: ['slash-div'],
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'pages': path.resolve(__dirname, './src/pages'),
      'stores': path.resolve(__dirname, './src/stores')
    }
  },
  server: {
    port: 9000
  },
  build: {
    outDir: 'dist'
  },
  base: '/'
})