import comp from "/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/githubAction.html.vue"
const data = JSON.parse("{\"path\":\"/githubAction.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"默认 vuepress 文档部署\",\"slug\":\"默认-vuepress-文档部署\",\"link\":\"#默认-vuepress-文档部署\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"githubAction.md\"}")
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
