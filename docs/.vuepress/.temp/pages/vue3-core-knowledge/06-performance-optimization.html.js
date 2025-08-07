import comp from "/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/vue3-core-knowledge/06-performance-optimization.html.vue"
const data = JSON.parse("{\"path\":\"/vue3-core-knowledge/06-performance-optimization.html\",\"title\":\"Vue3性能优化详解\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"🎯 性能优化概述\",\"slug\":\"🎯-性能优化概述\",\"link\":\"#🎯-性能优化概述\",\"children\":[{\"level\":3,\"title\":\"优化架构图\",\"slug\":\"优化架构图\",\"link\":\"#优化架构图\",\"children\":[]}]},{\"level\":2,\"title\":\"🔧 编译时优化\",\"slug\":\"🔧-编译时优化\",\"link\":\"#🔧-编译时优化\",\"children\":[{\"level\":3,\"title\":\"1. 静态提升 (Static Hoisting)\",\"slug\":\"_1-静态提升-static-hoisting\",\"link\":\"#_1-静态提升-static-hoisting\",\"children\":[]},{\"level\":3,\"title\":\"2. 补丁标志 (Patch Flags)\",\"slug\":\"_2-补丁标志-patch-flags\",\"link\":\"#_2-补丁标志-patch-flags\",\"children\":[]},{\"level\":3,\"title\":\"3. 块级优化 (Block Optimization)\",\"slug\":\"_3-块级优化-block-optimization\",\"link\":\"#_3-块级优化-block-optimization\",\"children\":[]}]},{\"level\":2,\"title\":\"⚡ 运行时优化\",\"slug\":\"⚡-运行时优化\",\"link\":\"#⚡-运行时优化\",\"children\":[{\"level\":3,\"title\":\"1. 快速路径 (Fast Path)\",\"slug\":\"_1-快速路径-fast-path\",\"link\":\"#_1-快速路径-fast-path\",\"children\":[]},{\"level\":3,\"title\":\"2. 批量更新 (Batch Updates)\",\"slug\":\"_2-批量更新-batch-updates\",\"link\":\"#_2-批量更新-batch-updates\",\"children\":[]},{\"level\":3,\"title\":\"3. 缓存机制 (Caching)\",\"slug\":\"_3-缓存机制-caching\",\"link\":\"#_3-缓存机制-caching\",\"children\":[]}]},{\"level\":2,\"title\":\"💾 内存优化\",\"slug\":\"💾-内存优化\",\"link\":\"#💾-内存优化\",\"children\":[{\"level\":3,\"title\":\"1. WeakMap避免内存泄漏\",\"slug\":\"_1-weakmap避免内存泄漏\",\"link\":\"#_1-weakmap避免内存泄漏\",\"children\":[]},{\"level\":3,\"title\":\"2. 双向链表O(1)操作\",\"slug\":\"_2-双向链表o-1-操作\",\"link\":\"#_2-双向链表o-1-操作\",\"children\":[]},{\"level\":3,\"title\":\"3. 依赖清理机制\",\"slug\":\"_3-依赖清理机制\",\"link\":\"#_3-依赖清理机制\",\"children\":[]}]},{\"level\":2,\"title\":\"📊 性能监控\",\"slug\":\"📊-性能监控\",\"link\":\"#📊-性能监控\",\"children\":[{\"level\":3,\"title\":\"1. 性能指标\",\"slug\":\"_1-性能指标\",\"link\":\"#_1-性能指标\",\"children\":[]},{\"level\":3,\"title\":\"2. 性能分析\",\"slug\":\"_2-性能分析\",\"link\":\"#_2-性能分析\",\"children\":[]}]},{\"level\":2,\"title\":\"🎯 优化建议\",\"slug\":\"🎯-优化建议\",\"link\":\"#🎯-优化建议\",\"children\":[{\"level\":3,\"title\":\"1. 编译时优化建议\",\"slug\":\"_1-编译时优化建议\",\"link\":\"#_1-编译时优化建议\",\"children\":[]},{\"level\":3,\"title\":\"2. 运行时优化建议\",\"slug\":\"_2-运行时优化建议\",\"link\":\"#_2-运行时优化建议\",\"children\":[]},{\"level\":3,\"title\":\"3. 内存优化建议\",\"slug\":\"_3-内存优化建议\",\"link\":\"#_3-内存优化建议\",\"children\":[]}]},{\"level\":2,\"title\":\"🎯 总结\",\"slug\":\"🎯-总结\",\"link\":\"#🎯-总结\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"vue3-core-knowledge/06-performance-optimization.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
