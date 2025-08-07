import comp from "/Users/atian/Desktop/2025/blogs/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"headers\":[],\"git\":{\"updatedTime\":1754375829000,\"contributors\":[{\"name\":\"atian\",\"username\":\"atian\",\"email\":\"atian@micous.com\",\"commits\":2,\"url\":\"https://github.com/atian\"}],\"changelog\":[{\"hash\":\"24ad43f0c93ca0eaf8923ad66ce02b9134e4c154\",\"time\":1754375829000,\"email\":\"atian@micous.com\",\"author\":\"atian\",\"message\":\"更新VuePress配置，添加导航栏和侧边栏，修改语言设置为中文，并简化首页内容以记录学习文档和GitHub Actions教程。\"},{\"hash\":\"9e6e6b7104d4c87113791bcdf7ab32e8f8350340\",\"time\":1754302818000,\"email\":\"atian@micous.com\",\"author\":\"atian\",\"message\":\"更新.gitignore文件，添加了对pnpm调试日志、dist-ssr、编辑器目录和个人光标文件的忽略规则，同时移除了不必要的旧规则，以优化项目的文件管理。\"}]},\"filePathRelative\":\"README.md\"}")
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
