## 1.为什么vite比webpack要快
因为采用了不同的开发模式，充分利用了现代浏览器的ES Modules支持，编译使用了更高效底层的语言Go,优化了热更新的配置

## 2.常用的vite配置有哪些
```
 export default defineConfig({
  root: resolve(__dirname, '../'), // 表示项目的根路径
  logLevel: 'info', // 日志级别
  server: {
    host: true,   // 允许外部进行访问
    //  proxy 开发接口代理
    proxy: {
      '/PROXY_API_ACTIVITY': {
        target: 'https://activity-test.waka.media',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/PROXY_API_ACTIVITY/, '')
      },
      '/PROXY_ACTIVITY_DATA': {
        target: 'https://activity-h5-test.yoho.media',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/PROXY_ACTIVITY_DATA/, '')
      }
    }
  },
  plugins: [
    vue(),
    DevBuildPlugin(),
    hostInjectPlugin('-test'),
    autoImport({
      imports: ['vue', 'vue-router']
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        //生产环境时移除console
        // pure_funcs: ['console.log'],
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: { // 定义一些可以全局访问的变量
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    ENV: JSON.stringify('develop'),
    //  所有配置项
    CONFIG: JSON.stringify(base),
    //  axios 打包、开发域名添加
    DOMAIN: JSON.stringify(base.DOMAIN),
    PROJECT: 1 // 1 是 yoho  2 是 chatchill
  },
  resolve: { // 定义别名
    alias: {
      '@publicComponents': resolve(__dirname, '../src/components'),
      '@libraryParams': resolve(__dirname, '../utils'),
      '@publicJS': resolve(__dirname, '../utils'),
      '@publicTool': resolve(__dirname, '../utils/components'),
      '@public': resolve(__dirname, '../utils'),
      '@saveImage': resolve(__dirname, '../src/components/methods/saveImage.ts'),
      '@utils': resolve(__dirname, '../utils'), // === 新增
      '@components': resolve(__dirname, '../src/components'), // === 新增
      '@hooks': resolve(__dirname, '../src/hooks'), // === 新增
      '@server': resolve(__dirname, '../server') // === 新增
    }
  }
  // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息
  // clearScreen: true
})
```

## 3. vite常用的API有哪些
1. HMR API 是用来热更新的时候使用，Vite 通过特殊的 import.meta.hot 对象暴露手动 HMR API（感觉也不常用了解就行）
https://cn.vite.dev/guide/api-hmr.html 