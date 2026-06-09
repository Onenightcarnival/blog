# Blog Project

Personal blog built with VitePress + custom dark cosmic theme, deployed to GitHub Pages via GitHub Actions.

## Tech Stack

- **Framework**: VitePress 1.6.x with custom theme extending DefaultTheme
- **Deploy**: GitHub Pages via GitHub Actions
- **Language**: Chinese (zh-CN) primary

## Project Structure

```
docs/
  .vitepress/
    config.mts              # VitePress configuration
    theme/
      index.ts              # Custom theme entry (extends DefaultTheme)
      Layout.vue            # Custom layout (injects SnowCanvas + CosmicHero)
      styles/cosmic.css     # CSS variable overrides for dark cosmic theme
      components/
        SnowCanvas.vue      # Canvas-based snow particle effect
        CosmicHero.vue      # Custom homepage hero
        ArticleTimeline.vue # Timeline-style article listing
        TweetFeed.vue       # Waterfall feed for micro-posts
        WorksShowcase.vue   # Timeline-style works showcase
      loaders/
        posts.data.ts       # Article data loader (createContentLoader)
        tweets.data.ts      # Tweet data loader (createContentLoader)
  archive/                  # 存档 — blog articles (markdown)
  murmur/                   # 碎语 — micro-posts (markdown)
  distill/                  # 蒸馏 — works showcase
  public/                   # Static assets
  index.md                  # 原点 — homepage (layout: home)
.github/workflows/
  deploy.yml                # GitHub Pages deployment workflow
```

## Commands

- `bun install` — Install dependencies
- `bun run dev` — Start local dev server
- `bun run build` — Build for production
- `bun run preview` — Preview production build locally

## Content Conventions

- Articles: `docs/archive/<slug>.md` with frontmatter `title`, `date`, `category`, `tags`
- Murmurs: `docs/murmur/<date>-<slug>.md` with frontmatter `date` only, no title
- Content is auto-discovered by data loaders — no manual config needed
- Base path is `/blog/` (for GitHub Pages at `<user>.github.io/blog/`)
- Dark mode only (force-dark), no light/dark toggle
- Search ("打捞") only indexes archive content
