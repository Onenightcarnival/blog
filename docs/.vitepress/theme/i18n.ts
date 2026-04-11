import { computed } from 'vue'
import { useData } from 'vitepress'

const messages: Record<string, Record<string, string>> = {
  'zh-CN': {
    emptyArticles: '还没有文章，敬请期待...',
    emptyTweets: '还没有微博，敬请期待...',
    stayTuned: '敬请期待...',
    heroSlogan: '一个 SBTI 测出 DEAD 的 AI 工程师，在 2028 危机到来之前，抢先把自己蒸馏成 skill',
    heroName: '散是 token，聚是 skill',
    heroSubtitle: '至少博客还活着',
    categoryThoughts: '想明白的',
    categoryProjects: '做出来的',
  },
  'en-US': {
    emptyArticles: 'No articles yet, stay tuned...',
    emptyTweets: 'No posts yet, stay tuned...',
    stayTuned: 'Stay tuned...',
    heroSlogan: 'An AI engineer whose SBTI score came back DEAD, racing to distill himself into a skill before the 2028 crisis hits',
    heroName: 'Scattered as tokens, gathered as skills',
    heroSubtitle: 'At least the blog is alive',
    categoryThoughts: 'Figured Out',
    categoryProjects: 'Built',
  },
}

export function useI18n() {
  const { lang } = useData()
  const isEn = computed(() => lang.value === 'en-US')
  const t = computed(() => messages[lang.value] || messages['zh-CN'])
  return { t, isEn, lang }
}
