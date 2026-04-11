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
        WorksShowcase.vue   # Card grid for projects
      loaders/
        posts.data.ts       # Article data loader (createContentLoader)
        tweets.data.ts      # Tweet data loader (createContentLoader)
  posts/                    # Blog articles (markdown)
  tweets/                   # Micro-posts / tweets (markdown)
  public/                   # Static assets
  index.md                  # Homepage (layout: home)
  works.md                  # Works showcase page
.github/workflows/
  deploy.yml                # GitHub Pages deployment workflow
```

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally

## Content Conventions

- Blog posts: `docs/posts/<slug>.md` with frontmatter `title`, `date`, `category`, `tags`
- Tweets: `docs/tweets/<date>-<slug>.md` with frontmatter `date` only, no title
- Posts and tweets are auto-discovered by data loaders — no manual config needed
- Base path is `/blog/` (for GitHub Pages at `<user>.github.io/blog/`)
- Dark mode only, no light/dark toggle
