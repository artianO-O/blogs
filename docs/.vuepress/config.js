import { defaultTheme } from "@vuepress/theme-default";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";

export default defineUserConfig({
  lang: "en-US",

  title: "我的主页",
  description: "My first VuePress Site",

  theme: defaultTheme({
    logo: "https://vuejs.press/images/hero.png",

    navbar: ["/"],
  }),

  bundler: viteBundler(),
});
