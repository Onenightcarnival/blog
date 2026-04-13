<script setup>
import DefaultTheme from 'vitepress/theme'
import SnowCanvas from './components/SnowCanvas.vue'
import CosmicHero from './components/CosmicHero.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import CosmicToggle from './components/CosmicToggle.vue'
import TranslationBanner from './components/TranslationBanner.vue'
import { useCosmicTheme } from './composables/useCosmicTheme'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Initialize theme on layout mount
useCosmicTheme()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ClientOnly>
        <SnowCanvas />
        <ScrollProgress />
      </ClientOnly>
    </template>
    <template #nav-bar-content-after>
      <ClientOnly>
        <CosmicToggle />
      </ClientOnly>
    </template>
    <template #home-hero-info v-if="frontmatter.layout === 'home'">
      <CosmicHero />
    </template>
    <template #doc-before>
      <TranslationBanner />
    </template>
  </Layout>
</template>
