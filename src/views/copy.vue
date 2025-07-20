<template>
  <div class="container">
    <!-- 页面内容占位 -->
    <div class="page-content" ref="contentRef">
     
      
      <!-- 导航栏 - 从这个元素开始吸顶 -->
      <div class="sticky-wrapper" ref="stickyRef">
        <nav :class="{ 'sticky': isSticky }" class="navigation">
          
        </nav>
      </div>
      
      <!-- 模拟长页面内容 -->
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// 获取内容区域和吸顶元素引用
const contentRef = ref(null)
const stickyRef = ref(null)

// 监听滚动事件
const isSticky = ref(false)
const stickyOffset = 72 // 设置吸顶距离为72px

// 处理滚动事件
const handleScroll = () => {
  if (stickyRef.value) {
    // 获取元素距离视口顶部的距离
    const rect = stickyRef.value.getBoundingClientRect()
    // 计算元素距离文档顶部的距离
    const elementTop = rect.top + window.scrollY
    
    // 当元素距离文档顶部的距离小于等于设定的偏移量时，启用吸顶效果
    isSticky.value = window.scrollY >= (elementTop - stickyOffset)
  }
}

// 组件挂载时添加滚动监听
onMounted(() => {
  // 等待DOM渲染完成后获取元素位置
  nextTick(() => {
    handleScroll() // 初始化位置
    window.addEventListener('scroll', handleScroll)
  })
})

// 组件卸载时移除滚动监听，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.hero-section {
  background-color: #42b883;
  color: white;
  text-align: center;
  padding: 80px 0;
  margin-bottom: 20px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 1.2rem;
}

.sticky-wrapper {
  position: relative;
}

.navigation {
  background-color: #35495e;
  color: white;
  transition: all 0.3s ease;
  width: 100%;
  height: 100vh;
}

.navigation ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navigation li {
  padding: 20px;
}

.navigation a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.navigation a:hover {
  text-decoration: underline;
}

/* 吸顶效果样式 */
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.long-content {
  padding: 20px;
}

.long-content h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.long-content p {
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>    