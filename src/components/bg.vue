<template>
    <canvas ref="canvas" class="particle-bg"></canvas>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref } from 'vue'
  
  const canvas = ref(null)
  let ctx, stars = []
  let offsetX = 0, offsetY = 0
  let targetOffsetX = 0, targetOffsetY = 0
  const numStars = 150
  
  function initCanvas() {
    const c = canvas.value
    c.width = c.offsetWidth
    c.height = c.offsetHeight
    ctx = c.getContext('2d')
  }
  
  function createStars() {
    stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * canvas.value.width,
      y: Math.random() * canvas.value.height,
      radius: Math.random() * 1.5 + 0.5,
      speedY: Math.random() * 0.3 + 0.1,
    }))
  }
  
  function updateStars() {
    for (const star of stars) {
      star.y -= star.speedY
      if (star.y < 0) {
        star.y = canvas.value.height
        star.x = Math.random() * canvas.value.width
      }
    }
  }
  
  function drawStars() {
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#fff'
    for (const star of stars) {
      ctx.beginPath()
      ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  function animate() {
    offsetX += (targetOffsetX - offsetX) * 0.05
    offsetY += (targetOffsetY - offsetY) * 0.05
    updateStars()
    drawStars()
    requestAnimationFrame(animate)
  }
  
  function handleMouseMove(e) {
    const w = canvas.value.offsetWidth
    const h = canvas.value.offsetHeight
    targetOffsetX = (e.clientX - w / 2) * 0.05
    targetOffsetY = (e.clientY - h / 2) * 0.05
  }
  
  function handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      const w = canvas.value.offsetWidth
      const h = canvas.value.offsetHeight
      targetOffsetX = (touch.clientX - w / 2) * 0.05
      targetOffsetY = (touch.clientY - h / 2) * 0.05
    }
  }
  
  onMounted(() => {
    initCanvas()
    createStars()
    animate()
    window.addEventListener('resize', () => {
      initCanvas()
      createStars()
    })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleTouchMove)
  })
  </script>
  
  <style scoped>
  .particle-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #151517;
    z-index: -1; /* 确保在最底层 */
    display: block;
    pointer-events: none; /* 避免遮挡其他组件交互 */
  }
  </style>
  