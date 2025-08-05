export const themeData = JSON.parse("{\"logo\":\"https://vuejs.press/images/hero.png\",\"navbar\":[{\"text\":\"主页\",\"link\":\"/get-started\"},{\"text\":\"教程\",\"link\":\"/githubAction\"},{\"text\":\"GitHub\",\"link\":\"https://github.com\"}],\"sidebar\":{\"/get-started\":[{\"text\":\"快速开始\",\"children\":[\"/get-started.md\"]}],\"/githubAction\":[{\"text\":\"GitHub Actions\",\"children\":[\"/githubAction.md\"]}]},\"footer\":\"MIT Licensed | Copyright © 2024\",\"editLink\":false,\"lastUpdated\":true,\"contributors\":false,\"backToTop\":true,\"locales\":{\"/\":{\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebarDepth\":2,\"editLinkText\":\"Edit this page\",\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
