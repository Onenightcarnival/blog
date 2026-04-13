<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { data as tweets } from '../loaders/tweets.data'
import { useI18n } from '../i18n'

const { t, isEn } = useI18n()

const localeTweets = computed(() =>
  tweets.filter(tweet =>
    isEn.value ? tweet.url.startsWith('/en/') : !tweet.url.startsWith('/en/')
  )
)

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Scroll reveal
const feedRef = ref(null)
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
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  )

  if (feedRef.value) {
    const cards = feedRef.value.querySelectorAll('.tweet-card')
    for (const card of cards) {
      observer.observe(card)
    }
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="tweet-feed" ref="feedRef">
    <div v-if="localeTweets.length === 0" class="empty">
      {{ t.emptyTweets }}
    </div>
    <div v-for="tweet in localeTweets" :key="tweet.url" class="tweet-card">
      <div class="tweet-date">{{ formatDate(tweet.date) }}</div>
      <div class="tweet-content" v-html="tweet.html" />
    </div>
  </div>
</template>

<style scoped>
.tweet-feed {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  color: var(--vp-c-text-3);
  text-align: center;
  padding: 60px 0;
}

.tweet-card {
  padding: 20px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-elv);
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
  /* Scroll reveal */
  opacity: 0;
  transform: translateY(16px);
}

.tweet-card.revealed {
  opacity: 1;
  transform: translateY(0);
}

.tweet-card:nth-child(2) { transition-delay: 0.05s; }
.tweet-card:nth-child(3) { transition-delay: 0.1s; }
.tweet-card:nth-child(4) { transition-delay: 0.15s; }

.tweet-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(139, 156, 247, 0) 0%,
    rgba(139, 156, 247, 0) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: background 0.35s ease;
}

.tweet-card:hover {
  border-color: rgba(139, 156, 247, 0.25);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(139, 156, 247, 0.06);
  transform: translateY(-2px);
}

.tweet-card:hover::before {
  background: linear-gradient(
    135deg,
    rgba(139, 156, 247, 0.2) 0%,
    rgba(196, 181, 253, 0.1) 100%
  );
}

.tweet-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  margin-bottom: 8px;
}

.tweet-content :deep(p) {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  line-height: 1.7;
}

.tweet-content :deep(p + p) {
  margin-top: 8px;
}

.tweet-content :deep(a) {
  color: var(--vp-c-brand-1);
  transition: text-shadow 0.2s;
}

.tweet-content :deep(a:hover) {
  text-shadow: 0 0 8px rgba(139, 156, 247, 0.4);
}

.tweet-content :deep(code) {
  font-size: 13px;
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
