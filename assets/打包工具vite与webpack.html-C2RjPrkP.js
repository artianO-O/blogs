import{_ as n,c as e,a as i,o as a}from"./app-BssVU5rO.js";const l={};function c(p,s){return a(),e("div",null,s[0]||(s[0]=[i(`<h2 id="_1-为什么vite比webpack要快" tabindex="-1"><a class="header-anchor" href="#_1-为什么vite比webpack要快"><span>1.为什么vite比webpack要快</span></a></h2><p>因为采用了不同的开发模式，充分利用了现代浏览器的ES Modules支持，编译使用了更高效底层的语言Go,优化了热更新的配置</p><h2 id="_2-常用的vite配置有哪些" tabindex="-1"><a class="header-anchor" href="#_2-常用的vite配置有哪些"><span>2.常用的vite配置有哪些</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line"> export default defineConfig({</span>
<span class="line">  root: resolve(__dirname, &#39;../&#39;), // 表示项目的根路径</span>
<span class="line">  logLevel: &#39;info&#39;, // 日志级别</span>
<span class="line">  server: {</span>
<span class="line">    host: true,   // 允许外部进行访问</span>
<span class="line">    //  proxy 开发接口代理</span>
<span class="line">    proxy: {</span>
<span class="line">      &#39;/PROXY_API_ACTIVITY&#39;: {</span>
<span class="line">        target: &#39;https://activity-test.waka.media&#39;,</span>
<span class="line">        changeOrigin: true,</span>
<span class="line">        rewrite: (path) =&gt; path.replace(/^\\/PROXY_API_ACTIVITY/, &#39;&#39;)</span>
<span class="line">      },</span>
<span class="line">      &#39;/PROXY_ACTIVITY_DATA&#39;: {</span>
<span class="line">        target: &#39;https://activity-h5-test.yoho.media&#39;,</span>
<span class="line">        changeOrigin: true,</span>
<span class="line">        rewrite: (path) =&gt; path.replace(/^\\/PROXY_ACTIVITY_DATA/, &#39;&#39;)</span>
<span class="line">      }</span>
<span class="line">    }</span>
<span class="line">  },</span>
<span class="line">  plugins: [</span>
<span class="line">    vue(),</span>
<span class="line">    DevBuildPlugin(),</span>
<span class="line">    hostInjectPlugin(&#39;-test&#39;),</span>
<span class="line">    autoImport({</span>
<span class="line">      imports: [&#39;vue&#39;, &#39;vue-router&#39;]</span>
<span class="line">    })</span>
<span class="line">  ],</span>
<span class="line">  build: {</span>
<span class="line">    minify: &#39;terser&#39;,</span>
<span class="line">    terserOptions: {</span>
<span class="line">      compress: {</span>
<span class="line">        //生产环境时移除console</span>
<span class="line">        // pure_funcs: [&#39;console.log&#39;],</span>
<span class="line">        drop_console: true,</span>
<span class="line">        drop_debugger: true</span>
<span class="line">      }</span>
<span class="line">    }</span>
<span class="line">  },</span>
<span class="line">  define: { // 定义一些可以全局访问的变量</span>
<span class="line">    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,</span>
<span class="line">    ENV: JSON.stringify(&#39;develop&#39;),</span>
<span class="line">    //  所有配置项</span>
<span class="line">    CONFIG: JSON.stringify(base),</span>
<span class="line">    //  axios 打包、开发域名添加</span>
<span class="line">    DOMAIN: JSON.stringify(base.DOMAIN),</span>
<span class="line">    PROJECT: 1 // 1 是 yoho  2 是 chatchill</span>
<span class="line">  },</span>
<span class="line">  resolve: { // 定义别名</span>
<span class="line">    alias: {</span>
<span class="line">      &#39;@publicComponents&#39;: resolve(__dirname, &#39;../src/components&#39;),</span>
<span class="line">      &#39;@libraryParams&#39;: resolve(__dirname, &#39;../utils&#39;),</span>
<span class="line">      &#39;@publicJS&#39;: resolve(__dirname, &#39;../utils&#39;),</span>
<span class="line">      &#39;@publicTool&#39;: resolve(__dirname, &#39;../utils/components&#39;),</span>
<span class="line">      &#39;@public&#39;: resolve(__dirname, &#39;../utils&#39;),</span>
<span class="line">      &#39;@saveImage&#39;: resolve(__dirname, &#39;../src/components/methods/saveImage.ts&#39;),</span>
<span class="line">      &#39;@utils&#39;: resolve(__dirname, &#39;../utils&#39;), // === 新增</span>
<span class="line">      &#39;@components&#39;: resolve(__dirname, &#39;../src/components&#39;), // === 新增</span>
<span class="line">      &#39;@hooks&#39;: resolve(__dirname, &#39;../src/hooks&#39;), // === 新增</span>
<span class="line">      &#39;@server&#39;: resolve(__dirname, &#39;../server&#39;) // === 新增</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">  // 设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息</span>
<span class="line">  // clearScreen: true</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-vite常用的api有哪些" tabindex="-1"><a class="header-anchor" href="#_3-vite常用的api有哪些"><span>3. vite常用的API有哪些</span></a></h2><ol><li>HMR API 是用来热更新的时候使用，Vite 通过特殊的 import.meta.hot 对象暴露手动 HMR API（感觉也不常用了解就行） https://cn.vite.dev/guide/api-hmr.html</li></ol>`,6)]))}const r=n(l,[["render",c]]),v=JSON.parse('{"path":"/%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7vite%E4%B8%8Ewebpack.html","title":"","lang":"zh-CN","frontmatter":{},"headers":[{"level":2,"title":"1.为什么vite比webpack要快","slug":"_1-为什么vite比webpack要快","link":"#_1-为什么vite比webpack要快","children":[]},{"level":2,"title":"2.常用的vite配置有哪些","slug":"_2-常用的vite配置有哪些","link":"#_2-常用的vite配置有哪些","children":[]},{"level":2,"title":"3. vite常用的API有哪些","slug":"_3-vite常用的api有哪些","link":"#_3-vite常用的api有哪些","children":[]}],"git":{"updatedTime":1755576741000,"contributors":[{"name":"atian","username":"atian","email":"atian@micous.com","commits":1,"url":"https://github.com/atian"}],"changelog":[{"hash":"635d3e0a8fcb3a382386d4e6fbbd4fe766644575","time":1755576741000,"email":"atian@micous.com","author":"atian","message":"更新依赖项，添加@ffmpeg-installer/ffmpeg及其相关模块，并在package.json中新增视频生成命令。"}]},"filePathRelative":"打包工具vite与webpack.md"}');export{r as comp,v as data};
