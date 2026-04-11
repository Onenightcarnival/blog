import { createContentLoader } from 'vitepress'

export interface PostData {
  url: string
  title: string
  date: string
  category?: string
  tags?: string[]
}

export default createContentLoader('{,en/}archive/*.md', {
  transform(rawData): PostData[] {
    return rawData
      .filter((page) => !page.url.endsWith('/archive/'))
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title,
        date: page.frontmatter.date,
        category: page.frontmatter.category,
        tags: page.frontmatter.tags,
      }))
  },
})

declare const data: PostData[]
export { data }
