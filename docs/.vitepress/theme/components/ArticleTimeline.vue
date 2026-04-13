<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../loaders/posts.data'
import { useI18n } from '../i18n'

const { t, isEn } = useI18n()

const localePosts = computed(() =>
  posts.filter(post =>
    isEn.value ? post.url.startsWith('/en/') : !post.url.startsWith('/en/')
  )
)

const groupedByYear = computed(() => {
  const groups = {}
  for (const post of localePosts.value) {
    const year = new Date(post.date).getFullYear()
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}-${day}`
}

// Scroll-driven reveal
const timelineRef = ref(null)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )

  if (timelineRef.value) {
    const nodes = timelineRef.value.querySelectorAll('.year-group, .post-node')
    for (const node of nodes) {
      observer.observe(node)
    }
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="article-timeline" ref="timelineRef">
    <div v-if="localePosts.length === 0" class="empty">
      {{ t.emptyArticles }}
    </div>
    <div class="timeline-track">
      <div v-for="[year, yearPosts] in groupedByYear" :key="year" class="year-group">
        <div class="year-node">
          <div class="year-dot" />
          <span class="year-label">{{ year }}</span>
        </div>
        <div v-for="post in yearPosts" :key="post.url" class="post-node">
          <div class="post-dot" />
          <div class="post-card">
            <span class="post-date">{{ formatDate(post.date) }}</span>
            <a :href="withBase(post.url)" class="post-link">{{ post.title }}</a>
            <span v-if="post.category" class="post-category">{{ post.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-timeline {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 0;
}

.empty {
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 60px 0;
}

/* Vertical axis line */
.timeline-track {
  position: relative;
  padding-left: 32px;
}

.timeline-track::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--vp-c-brand-1) 0%,
    var(--vp-c-brand-soft) 100%
  );
}

/* Scroll reveal */
.year-group,
.post-node {
  opacity: 0;
  transform: translateX(-12px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.year-group.revealed,
.post-node.revealed {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger children */
.post-node:nth-child(2) { transition-delay: 0.05s; }
.post-node:nth-child(3) { transition-delay: 0.1s; }
.post-node:nth-child(4) { transition-delay: 0.15s; }
.post-node:nth-child(5) { transition-delay: 0.2s; }

/* Year node */
.year-group {
  margin-bottom: 8px;
}

.year-node {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
}

.year-dot {
  position: absolute;
  left: -32px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-brand-1);
  box-shadow: 0 0 12px rgba(139, 156, 247, 0.3);
  transition: box-shadow 0.3s;
}

.year-group:hover .year-dot {
  box-shadow: 0 0 20px rgba(139, 156, 247, 0.5);
}

.year-label {
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 1px;
}

/* Post node */
.post-node {
  position: relative;
  padding: 8px 0;
}

.post-dot {
  position: absolute;
  left: -28px;
  top: 18px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0.6;
  transition: all 0.25s;
}

.post-node:hover .post-dot {
  opacity: 1;
  box-shadow: 0 0 10px rgba(139, 156, 247, 0.6);
  transform: scale(1.3);
}

.post-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.post-card:hover {
  background: rgba(139, 156, 247, 0.04);
  border-color: rgba(139, 156, 247, 0.1);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  transform: translateX(4px);
}

.post-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
}

.post-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.post-category {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 10px;
  flex-shrink: 0;
}
</style>
