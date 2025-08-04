import { CodeTabs } from "/Users/atian/Desktop/2025/blogs/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/Users/atian/Desktop/2025/blogs/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/Users/atian/Desktop/2025/blogs/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
