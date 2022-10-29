import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import ssr from 'vite-plugin-ssr/plugin'
// import { viteExternalsPlugin } from 'vite-plugin-externals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ssr(),
    // viteExternalsPlugin({
    //   immer: 'immer',
    // }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://life.hokori.online/api',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
      },
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: '@use "@/styles" as common;',
  //       importer(...args) {
  //         if (args[0] !== '@/styles') {
  //           return
  //         }
  //         console.log('args', args)

  //         return {
  //           file: `${path.resolve(__dirname, './src/assets/styles')}`,
  //         }
  //       },
  //     },
  //   },
  // },
})
