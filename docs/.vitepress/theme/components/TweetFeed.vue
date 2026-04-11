<script setup>
import { computed } from 'vue'
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
</script>

<template>
  <div class="tweet-feed">
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
  transition: border-color 0.25s;
}

.tweet-card:hover {
  border-color: rgba(139, 156, 247, 0.25);
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
}

.tweet-content :deep(code) {
  font-size: 13px;
  background: var(--vp-code-bg);
  color: var(--vp-code-color);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
