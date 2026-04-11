import { createContentLoader } from 'vitepress'

export interface TweetData {
  url: string
  date: string
  html: string
}

export default createContentLoader('murmur/*.md', {
  render: true,
  transform(rawData): TweetData[] {
    return rawData
      .filter((page) => page.url !== '/murmur/')
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((page) => ({
        url: page.url,
        date: page.frontmatter.date,
        html: page.html!,
      }))
  },
})

declare const data: TweetData[]
export { data }
