<template><div><h2 id="默认-vuepress-文档部署" tabindex="-1"><a class="header-anchor" href="#默认-vuepress-文档部署"><span>默认 vuepress 文档部署</span></a></h2>
<p>基础的部署流程参考阮一峰大佬的文章：https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html</p>
<p>on: 指定事件触发，可以是 pull 事件也可以是定时器
jobs: 任务，一个任务由多个工作流组成
steps: 步骤，一个任务由多个步骤构成</p>
<ul>
<li>name：action,一个步骤由多个 action 构成
下列工作主要有
部署环境：ubuntu-latest
1.- name: Checkout // 下载源码到工作区
2.- name: 设置 Node.js //下载 node
3.- name: 安装依赖 // 下载依赖
4.- name: 构建文档 // 运行打包命令
5.- name: 部署文档 // 迁移文档到 branch: gh-pages 分支中,迁移源为：folder: docs/.vuepress/dist</li>
</ul>
<p>接下来只要 push 代码，就会自动执行下面的 actions,在 settings 选择 pages,deploy from a branch,选择 gh-pages 就可以看到部署的网页了
部署的时候，需要注意.vuepress/config.js 配置 base: &quot;/blogs/&quot;, 需要保持与项目同名</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">name: 部署文档</span>
<span class="line"></span>
<span class="line">on:</span>
<span class="line">  push:</span>
<span class="line">    branches:</span>
<span class="line">      # 确保这是你正在使用的分支名称</span>
<span class="line">      - main</span>
<span class="line"></span>
<span class="line">permissions:</span>
<span class="line">  contents: write</span>
<span class="line"></span>
<span class="line">jobs:</span>
<span class="line">  deploy-gh-pages:</span>
<span class="line">    runs-on: ubuntu-latest</span>
<span class="line">    steps:</span>
<span class="line">      - name: Checkout</span>
<span class="line">        uses: actions/checkout@v4</span>
<span class="line">        with:</span>
<span class="line">          fetch-depth: 0</span>
<span class="line">          # 如果你文档需要 Git 子模块，取消注释下一行</span>
<span class="line">          # submodules: true</span>
<span class="line"></span>
<span class="line">      - name: 设置 Node.js</span>
<span class="line">        uses: actions/setup-node@v4</span>
<span class="line">        with:</span>
<span class="line">          node-version: 20</span>
<span class="line">          cache: npm</span>
<span class="line"></span>
<span class="line">      - name: 安装依赖</span>
<span class="line">        run: npm ci</span>
<span class="line"></span>
<span class="line">      - name: 构建文档</span>
<span class="line">        env:</span>
<span class="line">          NODE_OPTIONS: --max_old_space_size=8192</span>
<span class="line">        run: |-</span>
<span class="line">          npm run docs:build</span>
<span class="line">          > docs/.vuepress/dist/.nojekyll</span>
<span class="line"></span>
<span class="line">      - name: 部署文档</span>
<span class="line">        uses: JamesIves/github-pages-deploy-action@v4</span>
<span class="line">        with:</span>
<span class="line">          # 这是文档部署到的分支名称</span>
<span class="line">          branch: gh-pages</span>
<span class="line">          folder: docs/.vuepress/dist</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


