<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter, page } = useData()

const originalUrl = computed(() => {
  if (frontmatter.value.originalUrl) return frontmatter.value.originalUrl
  // Auto-derive: /en/archive/hello-world -> /archive/hello-world
  const path = page.value.relativePath
  if (path.startsWith('en/')) {
    return withBase('/' + path.replace(/^en\//, '').replace(/\.md$/, ''))
  }
  return null
})
</script>

<template>
  <div v-if="frontmatter.translated" class="translation-banner">
    <span class="banner-icon">&#9888;</span>
    This post was translated from Chinese by AI and may contain inaccuracies.
    <a v-if="originalUrl" :href="originalUrl" class="original-link">Read the original</a>
  </div>
</template>

<style scoped>
.translation-banner {
  max-width: 688px;
  margin: 16px auto 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.2);
  color: rgba(234, 179, 8, 0.9);
  font-size: 14px;
  line-height: 1.5;
}

.banner-icon {
  margin-right: 6px;
}

.original-link {
  color: var(--vp-c-brand-1);
  margin-left: 4px;
}
</style>
