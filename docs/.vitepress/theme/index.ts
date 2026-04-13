import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './styles/cosmic.css'

import ArticleTimeline from './components/ArticleTimeline.vue'
import TweetFeed from './components/TweetFeed.vue'
import WorksShowcase from './components/WorksShowcase.vue'
import TranslationBanner from './components/TranslationBanner.vue'
import PyodideRunner from './components/PyodideRunner.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('ArticleTimeline', ArticleTimeline)
    app.component('TweetFeed', TweetFeed)
    app.component('WorksShowcase', WorksShowcase)
    app.component('TranslationBanner', TranslationBanner)
    app.component('PyodideRunner', PyodideRunner)
  },
} satisfies Theme
