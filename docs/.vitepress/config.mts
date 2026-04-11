import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Onenightcarnival",
  description: "散是 token，聚是 skill，至少博客还活着",
  lang: 'zh-CN',
  appearance: 'force-dark',

  // GitHub Pages deploy base path
  // If deploying to https://<user>.github.io/blog/, set base to '/blog/'
  // If deploying to a custom domain, set base to '/'
  base: '/blog/',

  themeConfig: {
    nav: [
      { text: '原点', link: '/' },
      { text: '存档', link: '/archive/' },
      { text: '碎语', link: '/murmur/' },
      { text: '蒸馏', link: '/distill/' },
    ],

    sidebar: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Onenightcarnival' },
    ],

    outline: {
      label: '目录',
    },

    search: {
      provider: 'local',
      options: {
        exclude: ['/murmur/**', '/distill/**'],
        translations: {
          button: {
            buttonText: '打捞',
            buttonAriaLabel: '打捞',
          },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除',
            backButtonTitle: '返回',
            noResultsText: '捞了个寂寞',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    footer: {
      message: '<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>',
      copyright: `Copyright © ${new Date().getFullYear()} Chao Li`,
    },
  },
})
