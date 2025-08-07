import comp from "/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/vue3-core-knowledge/04-compiler-system.html.vue"
const data = JSON.parse("{\"path\":\"/vue3-core-knowledge/04-compiler-system.html\",\"title\":\"Vue3编译器系统详解\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"🎯 编译器概述\",\"slug\":\"🎯-编译器概述\",\"link\":\"#🎯-编译器概述\",\"children\":[{\"level\":3,\"title\":\"编译器架构图\",\"slug\":\"编译器架构图\",\"link\":\"#编译器架构图\",\"children\":[]}]},{\"level\":2,\"title\":\"🔍 解析阶段 (Parse)\",\"slug\":\"🔍-解析阶段-parse\",\"link\":\"#🔍-解析阶段-parse\",\"children\":[{\"level\":3,\"title\":\"1. 词法分析 (Lexical Analysis)\",\"slug\":\"_1-词法分析-lexical-analysis\",\"link\":\"#_1-词法分析-lexical-analysis\",\"children\":[]},{\"level\":3,\"title\":\"2. 语法分析 (Syntax Analysis)\",\"slug\":\"_2-语法分析-syntax-analysis\",\"link\":\"#_2-语法分析-syntax-analysis\",\"children\":[]},{\"level\":3,\"title\":\"3. AST节点类型\",\"slug\":\"_3-ast节点类型\",\"link\":\"#_3-ast节点类型\",\"children\":[]}]},{\"level\":2,\"title\":\"🔄 转换阶段 (Transform)\",\"slug\":\"🔄-转换阶段-transform\",\"link\":\"#🔄-转换阶段-transform\",\"children\":[{\"level\":3,\"title\":\"1. 转换器架构\",\"slug\":\"_1-转换器架构\",\"link\":\"#_1-转换器架构\",\"children\":[]},{\"level\":3,\"title\":\"2. 静态提升 (Static Hoisting)\",\"slug\":\"_2-静态提升-static-hoisting\",\"link\":\"#_2-静态提升-static-hoisting\",\"children\":[]},{\"level\":3,\"title\":\"3. 补丁标志 (Patch Flags)\",\"slug\":\"_3-补丁标志-patch-flags\",\"link\":\"#_3-补丁标志-patch-flags\",\"children\":[]},{\"level\":3,\"title\":\"4. 块级优化 (Block Optimization)\",\"slug\":\"_4-块级优化-block-optimization\",\"link\":\"#_4-块级优化-block-optimization\",\"children\":[]}]},{\"level\":2,\"title\":\"🎨 代码生成 (Codegen)\",\"slug\":\"🎨-代码生成-codegen\",\"link\":\"#🎨-代码生成-codegen\",\"children\":[{\"level\":3,\"title\":\"1. 代码生成器\",\"slug\":\"_1-代码生成器\",\"link\":\"#_1-代码生成器\",\"children\":[]},{\"level\":3,\"title\":\"2. 节点代码生成\",\"slug\":\"_2-节点代码生成\",\"link\":\"#_2-节点代码生成\",\"children\":[]},{\"level\":3,\"title\":\"3. 优化代码生成\",\"slug\":\"_3-优化代码生成\",\"link\":\"#_3-优化代码生成\",\"children\":[]}]},{\"level\":2,\"title\":\"🔧 编译器优化\",\"slug\":\"🔧-编译器优化\",\"link\":\"#🔧-编译器优化\",\"children\":[{\"level\":3,\"title\":\"1. 编译时优化\",\"slug\":\"_1-编译时优化\",\"link\":\"#_1-编译时优化\",\"children\":[]},{\"level\":3,\"title\":\"2. 运行时优化\",\"slug\":\"_2-运行时优化\",\"link\":\"#_2-运行时优化\",\"children\":[]}]},{\"level\":2,\"title\":\"📊 性能优化\",\"slug\":\"📊-性能优化\",\"link\":\"#📊-性能优化\",\"children\":[{\"level\":3,\"title\":\"1. 编译时优化策略\",\"slug\":\"_1-编译时优化策略\",\"link\":\"#_1-编译时优化策略\",\"children\":[]},{\"level\":3,\"title\":\"2. 运行时优化策略\",\"slug\":\"_2-运行时优化策略\",\"link\":\"#_2-运行时优化策略\",\"children\":[]}]},{\"level\":2,\"title\":\"🎯 总结\",\"slug\":\"🎯-总结\",\"link\":\"#🎯-总结\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"vue3-core-knowledge/04-compiler-system.md\"}")
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
