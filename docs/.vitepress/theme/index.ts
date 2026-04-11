import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './styles/cosmic.css'

import ArticleTimeline from './components/ArticleTimeline.vue'
import TweetFeed from './components/TweetFeed.vue'
import WorksShowcase from './components/WorksShowcase.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ArticleTimeline', ArticleTimeline)
    app.component('TweetFeed', TweetFeed)
    app.component('WorksShowcase', WorksShowcase)
  },
} satisfies Theme
