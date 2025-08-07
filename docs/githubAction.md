## 默认 vuepress 文档部署

基础的部署流程参考阮一峰大佬的文章：https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html

on: 指定事件触发，可以是 pull 事件也可以是定时器
jobs: 任务，一个任务由多个工作流组成
steps: 步骤，一个任务由多个步骤构成

```
- name：action,一个步骤由多个 action 构成
  下列工作主要有
  部署环境：ubuntu-latest
  1.- name: Checkout // 下载源码到工作区
  2.- name: 设置 Node.js //下载 node
  3.- name: 安装依赖 // 下载依赖
  4.- name: 构建文档 // 运行打包命令
  5.- name: 部署文档 // 迁移文档到 branch: gh-pages 分支中,迁移源为：folder: docs/.vuepress/dist
```

接下来只要 push 代码，就会自动执行下面的 actions,在 settings 选择 pages,deploy from a branch,选择 gh-pages 就可以看到部署的网页了
部署的时候，需要注意.vuepress/config.js 配置 base: "/blogs/", 需要保持与项目同名
https://github.com/actions
https://github.com/marketplace?type=actions

```
name: 部署文档

on:
  push:
    branches:
      # 确保这是你正在使用的分支名称
      - main

permissions:
  contents: write

jobs:
  deploy-gh-pages:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          # 如果你文档需要 Git 子模块，取消注释下一行
          # submodules: true

      - name: 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: 安装依赖
        run: npm ci

      - name: 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        run: |-
          npm run docs:build
          > docs/.vuepress/dist/.nojekyll

      - name: 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 这是文档部署到的分支名称
          branch: gh-pages
          folder: docs/.vuepress/dist

```
