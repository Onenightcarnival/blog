<script setup>
import DefaultTheme from 'vitepress/theme'
import SnowCanvas from './components/SnowCanvas.vue'
import CosmicHero from './components/CosmicHero.vue'
import ScrollProgress from './components/ScrollProgress.vue'
import TranslationBanner from './components/TranslationBanner.vue'
import { useData } from 'vitepress'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #layout-top>
      <ClientOnly>
        <SnowCanvas />
        <ScrollProgress />
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
