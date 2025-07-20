<template>
  <div>
    <div ref="targetRef" class="my-block">
      <Swiper :modules="[Mousewheel, Pagination]" :slides-per-view="1" :space-between="30"
        :pagination="{ clickable: true }" :mousewheel="{ releaseOnEdges: true }" @swiper="onSwiperInit"
        @slideChange="onSlideChange" style="height: 100%">
        <SwiperSlide v-for="n in slideCount" :key="n">
          <div class="slide-content">Slide {{ n }}</div>
        </SwiperSlide>
      </Swiper>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const targetRef = ref(null)
const distanceTop = ref(0)
const swiperInstance = ref(null)
const slideCount = 5
const hasReset = ref(false) // 防止多次 slideTo(0) 重复触发

function handleScroll() {
  if (targetRef.value) {
    const rect = targetRef.value.getBoundingClientRect()
    distanceTop.value = rect.top

    // 如果区域**完全离开视口**，重置swiper到0
    // rect.bottom <= 0：完全在视口上方
    // rect.top >= window.innerHeight：完全在视口下方
    if (
      swiperInstance.value &&
      !hasReset.value &&
      (rect.bottom <= 0 || rect.top >= window.innerHeight)
    ) {
      swiperInstance.value.slideTo(0, 0) // 0ms动画立即归零
      hasReset.value = true
    }
    // 如果重新进入视口，允许再次重置
    if (
      swiperInstance.value &&
      hasReset.value &&
      rect.bottom > 0 &&
      rect.top < window.innerHeight
    ) {
      hasReset.value = false
    }
console.log(rect.top)
    // 锁定滚动逻辑
    if (
      rect.top < 200 &&
      swiperInstance.value &&
      swiperInstance.value.activeIndex !== 0 &&
      swiperInstance.value.activeIndex !== slideCount - 1
    ) {
      console.log("cccc")
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}

function onSwiperInit(swiper) {
  swiperInstance.value = swiper
  swiper.el.addEventListener('wheel', onSwiperWheel, { passive: false })
}
function onSlideChange(swiper) {
  swiperInstance.value = swiper
  handleScroll()
}
function onSwiperWheel(event) {
  if (!swiperInstance.value) return
  if (swiperInstance.value.activeIndex === 0 && event.deltaY < 0) {
    document.body.style.overflow = ''
  }
  if (swiperInstance.value.activeIndex === slideCount - 1 && event.deltaY > 0) {
    document.body.style.overflow = ''
  }
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (swiperInstance.value && swiperInstance.value.el) {
    swiperInstance.value.el.removeEventListener('wheel', onSwiperWheel)
  }
  document.body.style.overflow = ''
})
</script>


<style scoped>
.my-block {
  height: 100vh;
  background: #f77;
  margin-top: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  font-size: 2rem;
  color: #fff;
  background: #f44;
  border-radius: 12px;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
