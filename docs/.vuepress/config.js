import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
  // 语言设置
  lang: "zh-CN",
  title: "我的主页",
  description: "我的个人博客和技术分享站点",
  base: "/blogs/",

  // 主题配置
  theme: defaultTheme({
    // Logo配置
    logo: "https://vuejs.press/images/hero.png",

    // 导航栏配置
    navbar: [
      {
        text: "主页",
        link: "/get-started",
      },
      {
        text: "教程",
        link: "/githubAction",
      },
      {
        text: "Vue3源码解析",
        link: "/vue3-core",
      },
    ],

    // 侧边栏配置
    sidebar: {
      "/get-started": [
        {
          text: "快速开始",
          children: ["/get-started.md"],
        },
      ],
      "/githubAction": [
        {
          text: "GitHub Actions",
          children: ["/githubAction.md"],
        },
      ],
      "/": [
        {
          text: "Vue3核心知识",
          collapsible: true,
          children: [
            "/vue3-core",
            "/01-architecture-design",
            "/02-reactivity-system",
            "/03-virtual-dom-system",
            "/04-compiler-system",
            "/05-component-system",
            "/06-performance-optimization",
          ],
        },
      ],
    },

    // 页脚配置
    footer: "MIT Licensed | Copyright © 2024",

    // 编辑链接
    editLink: false,

    // 最后更新时间
    lastUpdated: true,

    // 贡献者信息
    contributors: false,

    // 返回顶部按钮
    backToTop: true,
  }),

  // 打包器配置
  bundler: viteBundler(),

  // 头部配置
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
});
