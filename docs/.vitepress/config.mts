import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Onenightcarnival",
  description: "散是 token，聚是 skill，至少博客还活着",
  appearance: 'force-dark',

  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === 'python run' || info.startsWith('python run ')) {
          const encoded = Buffer.from(token.content).toString('base64')
          return `<PyodideRunner code="${encoded}" />\n`
        }
        return defaultFence(tokens, idx, options, env, self)
      }
    },
  },

  // GitHub Pages deploy base path
  // If deploying to https://<user>.github.io/blog/, set base to '/blog/'
  // If deploying to a custom domain, set base to '/'
  base: '/blog/',

  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'Scattered as tokens, gathered as skills — at least the blog is alive',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Archive', link: '/en/archive/' },
          { text: 'Murmur', link: '/en/murmur/' },
          { text: 'Distill', link: '/en/distill/' },
        ],
        outline: {
          label: 'On this page',
        },
      },
    },
  },

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
        exclude: ['/murmur/**', '/distill/**', '/en/murmur/**', '/en/distill/**'],
        locales: {
          root: {
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
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                displayDetails: 'Show details',
                resetButtonTitle: 'Clear',
                backButtonTitle: 'Back',
                noResultsText: 'No results found',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close',
                },
              },
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
