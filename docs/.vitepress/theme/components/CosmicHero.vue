<script setup>
</script>

<template>
  <div class="cosmic-hero">
    <p class="hero-slogan">一个 SBTI 测出 DEAD 的 AI 工程师，在 2028 危机到来之前，抢先把自己蒸馏成 skill</p>
    <h1 class="hero-name">
      <span class="hero-name-clip">散是 token，聚是 skill</span>
    </h1>
    <p class="hero-subtitle">至少博客还活着</p>
  </div>
</template>

<style scoped>
.cosmic-hero {
  text-align: center;
  padding: 80px 24px 60px;
}

.hero-slogan {
  margin: 0 0 24px;
  font-size: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.8;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.hero-name {
  margin: 0 0 16px;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
}

.hero-name-clip {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.hero-subtitle {
  margin: 0;
  font-size: 16px;
  color: var(--vp-c-text-3);
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-block;
  padding: 10px 28px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
}

.action-btn.brand {
  color: var(--vp-button-brand-text);
  background: var(--vp-button-brand-bg);
  border: 1px solid var(--vp-button-brand-border);
}

.action-btn.brand:hover {
  background: var(--vp-button-brand-hover-bg);
  border-color: var(--vp-button-brand-hover-border);
}

.action-btn.alt {
  color: var(--vp-button-alt-text);
  background: var(--vp-button-alt-bg);
  border: 1px solid var(--vp-button-alt-border);
}

.action-btn.alt:hover {
  background: var(--vp-button-alt-hover-bg);
  border-color: var(--vp-button-alt-hover-border);
}

@media (min-width: 640px) {
  .hero-name {
    font-size: 48px;
  }
  .hero-tagline {
    font-size: 24px;
  }
}
</style>
