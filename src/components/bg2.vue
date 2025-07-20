<template>
    <div ref="container" class="starfield-container">
      <canvas ref="canvas" class="starfield-canvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const container = ref(null);
  const canvas = ref(null);
  let ctx;
  const dpr = window.devicePixelRatio || 1;
  
  let baseW = 0;
  let baseH = 0;
  let spaceSize = 0; // 使用虚拟正方形空间，解决拉伸
  let centerX = 0;
  let centerY = 0;
  let focalLength = 0;
  
  let stars = [];
  const numStars = 1900;
  const fixedWarpSpeed = 0.2;
  const speedMultiplier = 20;
  const starSize = 1.5;
  const trailWidth = 1.2;
  const maxTrailLength = 30;
  
  let animationId;
  let resizeObserver;
  
  // 增大边缘柔化宽度
  const fadeSize = 160;
  const maskColor = "#151517";
  
  // 边缘柔化mask
  function drawEdgeFadeMask(ctx, width, height, fadeSize = 160, color = "#151517") {
    // 上
    let grad = ctx.createLinearGradient(0, 0, 0, fadeSize);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(21,21,23,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, fadeSize);
  
    // 下
    grad = ctx.createLinearGradient(0, height - fadeSize, 0, height);
    grad.addColorStop(0, "rgba(21,21,23,0)");
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.fillRect(0, height - fadeSize, width, fadeSize);
  
    // 左
    grad = ctx.createLinearGradient(0, 0, fadeSize, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(21,21,23,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, fadeSize, height);
  
    // 右
    grad = ctx.createLinearGradient(width - fadeSize, 0, width, 0);
    grad.addColorStop(0, "rgba(21,21,23,0)");
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.fillRect(width - fadeSize, 0, fadeSize, height);
  }
  
  function resizeCanvas() {
    if (!container.value || !canvas.value) return;
    const rect = container.value.getBoundingClientRect();
    baseW = rect.width;
    baseH = rect.height;
    // 用max保证横竖屏都不会拉伸失真
    spaceSize = Math.max(baseW, baseH);
    centerX = baseW / 2;
    centerY = baseH / 2;
    focalLength = spaceSize * 2;
  
    canvas.value.width = baseW * dpr;
    canvas.value.height = baseH * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 防止多次缩放
    ctx.scale(dpr, dpr);
  
    stars.forEach(s => s.trail = []);
  }
  
  function initializeStars() {
    stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * spaceSize,
      y: Math.random() * spaceSize,
      z: Math.random() * spaceSize,
      o: 0.5 + Math.random() * 0.5,
      trail: []
    }));
  }
  
  function moveStars() {
    const speed = 1 + fixedWarpSpeed * speedMultiplier;
    stars.forEach(star => {
      star.z -= speed;
      if (star.z < 1) {
        star.z = spaceSize;
        star.x = Math.random() * spaceSize;
        star.y = Math.random() * spaceSize;
        star.trail = [];
      }
    });
  }
  
  function drawStars() {
    ctx.clearRect(0, 0, baseW, baseH);
    ctx.fillStyle = maskColor;
    ctx.fillRect(0, 0, baseW, baseH);
  
    stars.forEach(star => {
      // 虚拟正方形坐标转换
      const px = (star.x - spaceSize / 2) * (focalLength / star.z) + centerX;
      const py = (star.y - spaceSize / 2) * (focalLength / star.z) + centerY;
  
      star.trail.push({ x: px, y: py });
      if (star.trail.length > maxTrailLength) star.trail.shift();
  
      if (star.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(star.trail[0].x, star.trail[0].y);
        star.trail.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = `rgba(209,255,255,${star.o * 0.7})`;
        ctx.lineWidth = trailWidth;
        ctx.stroke();
      }
  
      ctx.fillStyle = `rgba(209,255,255,${star.o})`;
      ctx.fillRect(px - starSize / 2, py - starSize / 2, starSize, starSize);
    });
  
    // 四周边界渐变
    drawEdgeFadeMask(ctx, baseW, baseH, fadeSize, maskColor);
  }
  
  function animate() {
    animationId = requestAnimationFrame(animate);
    moveStars();
    drawStars();
  }
  
  onMounted(() => {
    ctx = canvas.value.getContext('2d');
    resizeCanvas();
    initializeStars();
    animate();
    resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container.value);
  });
  
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    if (resizeObserver && container.value) {
      resizeObserver.unobserve(container.value);
    }
  });
  </script>
  
  <style scoped>
  .starfield-container {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 1;
  }
  .starfield-canvas {
    width: 100%;
    height: 100%;
    display: block;
    image-rendering: pixelated;
  }
  </style>
  