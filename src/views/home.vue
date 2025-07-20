<template>
  <div style="height: 600px; background: #e1e1e1;">上方内容</div>
  <div ref="swiperWrapper" class="swiper-sticky">
    <Swiper
      ref="swiperRef"
      :modules="modules"
      :slides-per-view="1"
      :space-between="30"
      :pagination="{ clickable: true }"
      direction="vertical"
      class="my-swiper"
      @swiper="onSwiper"
    >
      <SwiperSlide v-for="n in 5" :key="n">
        <div class="slide-content">Slide {{ n }}</div>
      </SwiperSlide>
    </Swiper>
  </div>
  <div style="height: 600px; background: #e1e1e1;">下方内容</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

const modules = [Pagination]
const swiperRef = ref(null)
const swiperWrapper = ref(null)
let swiperIns = null
const isSticky = ref(false)
const swiperIndex = ref(0)
const slideCount = 5  // 总slides数量

function onSwiper(swiper) {
  swiperIns = swiper
  swiper.on('slideChange', () => {
    swiperIndex.value = swiper.activeIndex
  })
}

function lockBodyScroll() {
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.overflow = ''
}

// 判断swiperWrapper是否到达吸顶（页面顶部0）
function checkSticky() {
  const rect = swiperWrapper.value.getBoundingClientRect()
  if (rect.top <= 0 && rect.bottom > window.innerHeight / 2) {
    // Swiper区域已经吸顶
    isSticky.value = true
    lockBodyScroll()
  } else {
    isSticky.value = false
    unlockBodyScroll()
  }
}

// wheel事件处理
function handleWheel(e) {
  if (!isSticky.value || !swiperIns) return
  if (swiperIndex.value === 0 && e.deltaY < 0) {
    // 在第一个slide再往上滚，释放body滚动
    isSticky.value = false
    unlockBodyScroll()
    return
  }
  if (swiperIndex.value === slideCount - 1 && e.deltaY > 0) {
    // 在最后一个slide再往下滚，释放body滚动
    isSticky.value = false
    unlockBodyScroll()
    return
  }
  // 只有在sticky时拦截并切换swiper
  e.preventDefault()
  if (e.deltaY > 0) {
    swiperIns.slideNext()
  } else if (e.deltaY < 0) {
    swiperIns.slidePrev()
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkSticky, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: false })
  // 初始化一下
  setTimeout(checkSticky, 300)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkSticky)
  window.removeEventListener('wheel', handleWheel)
  unlockBodyScroll()
})
</script>

<style>
.my-swiper {
  height: 300px;
}
.slide-content {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eee;
  font-size: 2rem;
}
.swiper-sticky {
  position: relative;
  z-index: 10;
}
</style>
