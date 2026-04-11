<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animationId = null
let particles = []

class Snowflake {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -10
    this.radius = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.4 + 0.2
    this.speed = Math.random() * 0.6 + 0.2
    this.drift = Math.random() * 0.4 - 0.2
    this.sway = Math.random() * Math.PI * 2
    this.swaySpeed = Math.random() * 0.01 + 0.005
  }

  update(w, h) {
    this.y += this.speed
    this.sway += this.swaySpeed
    this.x += this.drift + Math.sin(this.sway) * 0.3
    if (this.y > h + 10 || this.x < -10 || this.x > w + 10) {
      this.reset(w, h)
    }
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
  }
}

function initCanvas() {
  const el = canvas.value
  if (!el) return

  const ctx = el.getContext('2d')
  const resize = () => {
    el.width = window.innerWidth
    el.height = window.innerHeight
  }

  resize()
  window.addEventListener('resize', resize)

  const count = window.innerWidth < 768 ? 30 : 60
  particles = Array.from({ length: count }, () => new Snowflake(el.width, el.height))

  const animate = () => {
    ctx.clearRect(0, 0, el.width, el.height)
    for (const p of particles) {
      p.update(el.width, el.height)
      p.draw(ctx)
    }
    animationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', resize)
  }
}

let cleanup = null

onMounted(() => {
  cleanup = initCanvas()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (cleanup) cleanup()
})
</script>

<template>
  <canvas ref="canvas" class="snow-canvas" />
</template>

<style scoped>
.snow-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
}
</style>
