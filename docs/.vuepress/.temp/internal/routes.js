export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/01-architecture-design.html", { loader: () => import(/* webpackChunkName: "01-architecture-design.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/01-architecture-design.html.js"), meta: {"title":"Vue3架构设计详解"} }],
  ["/02-reactivity-system.html", { loader: () => import(/* webpackChunkName: "02-reactivity-system.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/02-reactivity-system.html.js"), meta: {"title":"Vue3响应式系统详解"} }],
  ["/03-virtual-dom-system.html", { loader: () => import(/* webpackChunkName: "03-virtual-dom-system.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/03-virtual-dom-system.html.js"), meta: {"title":"Vue3虚拟DOM系统详解"} }],
  ["/04-compiler-system.html", { loader: () => import(/* webpackChunkName: "04-compiler-system.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/04-compiler-system.html.js"), meta: {"title":"Vue3编译器系统详解"} }],
  ["/05-component-system.html", { loader: () => import(/* webpackChunkName: "05-component-system.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/05-component-system.html.js"), meta: {"title":"Vue3组件系统详解"} }],
  ["/06-performance-optimization.html", { loader: () => import(/* webpackChunkName: "06-performance-optimization.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/06-performance-optimization.html.js"), meta: {"title":"Vue3性能优化详解"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":""} }],
  ["/cursorRule.html", { loader: () => import(/* webpackChunkName: "cursorRule.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/cursorRule.html.js"), meta: {"title":""} }],
  ["/get-started.html", { loader: () => import(/* webpackChunkName: "get-started.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/get-started.html.js"), meta: {"title":"前端技术进阶学习指南"} }],
  ["/githubAction.html", { loader: () => import(/* webpackChunkName: "githubAction.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/githubAction.html.js"), meta: {"title":""} }],
  ["/vue3-core.html", { loader: () => import(/* webpackChunkName: "vue3-core.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/vue3-core.html.js"), meta: {"title":"Vue3核心知识点总览"} }],
  ["/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91.html", { loader: () => import(/* webpackChunkName: "小程序开发.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/小程序开发.html.js"), meta: {"title":""} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
