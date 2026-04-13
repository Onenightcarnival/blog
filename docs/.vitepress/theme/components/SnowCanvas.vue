<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let animationId = null
let particles = []
let shootingStars = []
let mouseX = -1
let mouseY = -1

class Star {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -10
    this.radius = Math.random() * 1.8 + 0.5
    this.baseOpacity = Math.random() * 0.5 + 0.2
    this.opacity = this.baseOpacity
    this.speed = Math.random() * 0.3 + 0.05
    this.drift = Math.random() * 0.2 - 0.1
    this.sway = Math.random() * Math.PI * 2
    this.swaySpeed = Math.random() * 0.008 + 0.003
    // Twinkle
    this.twinkleSpeed = Math.random() * 0.03 + 0.01
    this.twinklePhase = Math.random() * Math.PI * 2
    // Color tint
    const tints = [
      [255, 255, 255],
      [200, 210, 255],
      [180, 190, 247],
      [220, 200, 255],
    ]
    this.color = tints[Math.floor(Math.random() * tints.length)]
  }

  update(w, h) {
    this.y += this.speed
    this.sway += this.swaySpeed
    this.x += this.drift + Math.sin(this.sway) * 0.2
    this.twinklePhase += this.twinkleSpeed
    this.opacity = this.baseOpacity + Math.sin(this.twinklePhase) * 0.15

    // Mouse proximity glow
    if (mouseX >= 0 && mouseY >= 0) {
      const dx = this.x - mouseX
      const dy = this.y - mouseY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        const boost = (1 - dist / 150) * 0.4
        this.opacity = Math.min(1, this.opacity + boost)
      }
    }

    if (this.y > h + 10 || this.x < -10 || this.x > w + 10) {
      this.reset(w, h)
    }
  }

  draw(ctx) {
    const [r, g, b] = this.color
    // Glow
    if (this.radius > 1.2) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.08})`
      ctx.fill()
    }
    // Core
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`
    ctx.fill()
  }
}

class ShootingStar {
  constructor(w, h) {
    this.reset(w, h)
  }

  reset(w, h) {
    this.x = Math.random() * w * 0.7
    this.y = Math.random() * h * 0.4
    this.len = Math.random() * 80 + 40
    this.speed = Math.random() * 8 + 6
    this.angle = (Math.random() * 0.4 + 0.2) * Math.PI
    this.opacity = 1
    this.decay = Math.random() * 0.015 + 0.01
    this.active = true
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    this.opacity -= this.decay
    if (this.opacity <= 0) this.active = false
  }

  draw(ctx) {
    const tailX = this.x - Math.cos(this.angle) * this.len
    const tailY = this.y - Math.sin(this.angle) * this.len
    const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y)
    grad.addColorStop(0, `rgba(200, 210, 255, 0)`)
    grad.addColorStop(1, `rgba(200, 210, 255, ${this.opacity})`)
    ctx.beginPath()
    ctx.moveTo(tailX, tailY)
    ctx.lineTo(this.x, this.y)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.stroke()
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

  const onMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }
  const onMouseLeave = () => {
    mouseX = -1
    mouseY = -1
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)

  const count = window.innerWidth < 768 ? 40 : 80
  particles = Array.from({ length: count }, () => new Star(el.width, el.height))

  let shootTimer = 0

  const animate = () => {
    ctx.clearRect(0, 0, el.width, el.height)

    for (const p of particles) {
      p.update(el.width, el.height)
      p.draw(ctx)
    }

    // Shooting stars
    shootTimer++
    if (shootTimer > 300 && Math.random() < 0.008) {
      shootingStars.push(new ShootingStar(el.width, el.height))
      shootTimer = 0
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      shootingStars[i].update()
      shootingStars[i].draw(ctx)
      if (!shootingStars[i].active) shootingStars.splice(i, 1)
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  return () => {
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseleave', onMouseLeave)
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
