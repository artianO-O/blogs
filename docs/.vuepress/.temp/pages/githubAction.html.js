import comp from "/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/githubAction.html.vue"
const data = JSON.parse("{\"path\":\"/githubAction.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"默认 vuepress 文档部署\",\"slug\":\"默认-vuepress-文档部署\",\"link\":\"#默认-vuepress-文档部署\",\"children\":[]}],\"git\":{\"updatedTime\":1754375829000,\"contributors\":[{\"name\":\"atian\",\"username\":\"atian\",\"email\":\"atian@micous.com\",\"commits\":1,\"url\":\"https://github.com/atian\"}],\"changelog\":[{\"hash\":\"24ad43f0c93ca0eaf8923ad66ce02b9134e4c154\",\"time\":1754375829000,\"email\":\"atian@micous.com\",\"author\":\"atian\",\"message\":\"更新VuePress配置，添加导航栏和侧边栏，修改语言设置为中文，并简化首页内容以记录学习文档和GitHub Actions教程。\"}]},\"filePathRelative\":\"githubAction.md\"}")
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
