<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n'

const { t, isEn } = useI18n()

const zhCategories = [
  {
    name: '想明白的',
    items: [
      {
        title: '大模型应用的工程哲学',
        description: '当软件系统的核心组件从确定性函数变成概率性语言模型，软件工程的基本原则会发生什么变化，又有什么不会变。',
        link: 'https://onenightcarnival.github.io/llm-engineering-philosophy/',
      },
    ],
  },
  {
    name: '做出来的',
    items: [
      {
        title: 'complexipy-mcp',
        description: '基于 complexipy 的 MCP server，为 Python 代码库提供认知复杂度分析，帮助定位过于复杂的函数。',
        link: 'https://github.com/Onenightcarnival/complexipy-mcp',
      },
    ],
  },
]

const enCategories = [
  {
    name: 'Figured Out',
    items: [
      {
        title: 'Engineering Philosophy for LLM Applications',
        description: 'When the core component of a software system shifts from deterministic functions to probabilistic language models — what changes in software engineering, and what stays the same.',
        link: 'https://onenightcarnival.github.io/llm-engineering-philosophy/',
      },
    ],
  },
  {
    name: 'Built',
    items: [
      {
        title: 'complexipy-mcp',
        description: 'An MCP server built on complexipy, providing cognitive complexity analysis for Python codebases to help locate overly complex functions.',
        link: 'https://github.com/Onenightcarnival/complexipy-mcp',
      },
    ],
  },
]

const categories = computed(() => isEn.value ? enCategories : zhCategories)
</script>

<template>
  <div class="works-showcase">
    <div v-for="cat in categories" :key="cat.name" class="category-group">
      <div class="category-node">
        <div class="category-dot" />
        <span class="category-label">{{ cat.name }}</span>
      </div>
      <div v-if="cat.items.length === 0" class="empty-hint">
        {{ t.stayTuned }}
      </div>
      <div v-for="item in cat.items" :key="item.title" class="work-node">
        <div class="work-dot" />
        <div class="work-card">
          <h3 class="work-title">
            <a :href="item.link" target="_blank" rel="noopener">
              {{ item.title }}
              <span class="external-icon">↗</span>
            </a>
          </h3>
          <p class="work-desc">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.works-showcase {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 0;
  position: relative;
  padding-left: 32px;
}

.works-showcase::before {
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

.category-group {
  margin-bottom: 8px;
}

.category-node {
  position: relative;
  display: flex;
  align-items: center;
  padding: 16px 0 8px;
}

.category-dot {
  position: absolute;
  left: -32px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 3px solid var(--vp-c-brand-1);
  box-shadow: 0 0 12px rgba(139, 156, 247, 0.3);
}

.category-label {
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 2px;
}

.empty-hint {
  padding: 12px 16px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.work-node {
  position: relative;
  padding: 8px 0;
}

.work-dot {
  position: absolute;
  left: -28px;
  top: 22px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0.6;
  transition: all 0.25s;
}

.work-node:hover .work-dot {
  opacity: 1;
  box-shadow: 0 0 8px rgba(139, 156, 247, 0.5);
}

.work-card {
  padding: 16px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  transition: all 0.25s;
}

.work-card:hover {
  border-color: rgba(139, 156, 247, 0.25);
}

.work-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.work-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.work-title a:hover {
  color: var(--vp-c-brand-1);
}

.external-icon {
  font-size: 13px;
  opacity: 0.5;
  margin-left: 4px;
}

.work-desc {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
