<template>
  <div class="test  wow animate__fadeIn animate__delay-0.5s">
    <!-- <div style="height: 1500px"></div> -->
    <div class="container" ref="container">
      <div class="left">
        <div
          class="left-inner-container"
          ref="leftContainer"
          :class="leftClassName"
        >
          <h2>{{ $t('histroy.title') }}</h2>

          <div
            v-for="(item, ind) in contanerList"
            :key="ind"
            v-show="ind === currentIndex"
            class="history-item"
            :class="{ active: ind === currentIndex }"
          >
            <div class="history-item__line">{{ item.historyTile }}</div>
            <ul v-if="item.historyContent">
              <li v-for="(content, key) in item.historyContent" :key="key">
                {{ content }}
              </li>
            </ul>
            <div class="circle-container">
              <div
                class="circle-item"
                :class="{ active: ind === currentIndex }"
                :key="ind"
                v-for="(_, ind) in contanerList"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div style="margin: 0 auto; width: 600px">
          <div
            v-for="(item, ind) in contanerList"
            v-slide="ind"
            :key="ind"
            :data-index="ind"
            class="right-container"
          >
            <div>
              <img
                :src="item.imageUrl"
                style="width: 400px; height: 267px"
                alt="image"
              />
            </div>
            <p style="height: 20px"></p>
            <h3>{{ item.title }}</h3>
          </div>
        </div>
      </div>
    </div>
    <swiperbar/>
    <!-- <div class="footer" style="height: 1000px"></div> -->
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick, onUnmounted ,computed} from "vue";
import swiperbar  from "@/components/swiper.vue"
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const map = new WeakMap();

const headerHeight = ref(72); // 头部的高度
const container = ref(null);
const currentIndex = ref(0);
const leftContainer = ref(null);
const leftClassName = ref("");
const timer = ref(0);

let scrollY = window.scrollY;
let scrollYDirection = "up";

const contanerList = computed(() =>
    [
        {
            historyTile: t('histroy.blockOne.title'),
            title: t('histroy.blockOne.silde'),
            imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
            historyContent: [
                t('histroy.blockOne.name1'),
                t('histroy.blockOne.name2'),
                t('histroy.blockOne.name3'),
                t('histroy.blockOne.name4'),
            ]
        },
        {
            historyTile: t('histroy.blockTwo.title'),
            title: t('histroy.blockTwo.silde'),
            imageUrl: new URL("@/assets/images/s1.png", import.meta.url).href,
            historyContent: [
                t('histroy.blockTwo.name1'),
                t('histroy.blockTwo.name2'),
                t('histroy.blockTwo.name3'),
                t('histroy.blockTwo.name4'),
            ]
        },
        {
          historyTile: t('histroy.blockThree.title'),
          title: t('histroy.blockThree.silde'),
            imageUrl: new URL("@/assets/images/s2.png", import.meta.url).href,
            historyContent: [
                t('histroy.blockThree.name1'),
                t('histroy.blockThree.name2'),
                t('histroy.blockThree.name3'),
                t('histroy.blockThree.name4'),
            ]
        }


    ]
)


// 右边列表
// const contanerList = ref([
//   {
//     imageUrl: new URL("@/assets/images/s1.png", import.meta.url).href,
//     title: "Built for Speed, Designed for Impact",
//     historyTile: "2025 Q3",
//     historyContent: ["测试网正式上线", "交易所UID映射"],
//   },
//   {
//     imageUrl: new URL("@/assets/images/s2.png", import.meta.url).href,
//     title: "Scaling Boundaries, Empowering Builders",
//     historyTile: "2025 Q4",
//     historyContent: ["主网正式上线", "链上身份系统", "API/SDK接口发布"],
//   },
//   {
//     imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
//     title: "From Network to Marketplace, Utility Unleashed",
//     historyTile: "2026 Q1",
//     historyContent: ["主网正式上线", "链上身份系统", "API/SDK接口发布"],
//   },
//   {
//     imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
//     title: "From Network to Marketplace, Utility Unleashed",
//     historyTile: "2026 Q2",
//     historyContent: ["主网正式上线", "链上身份系统", "API/SDK接口发布"],
//   },
//   {
//     imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
//     title: "From Network to Marketplace, Utility Unleashed",
//     historyTile: "2026 Q3",
//     historyContent: ["主网正式上线", "链上身份系统", "API/SDK接口发布"],
//   },
//   {
//     imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
//     title: "From Network to Marketplace, Utility Unleashed",
//     historyTile: "2026 Q4",
//     historyContent: ["主网正式上线", "链上身份系统", "API/SDK接口发布"],
//   },
// ]);
const ob = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        //   const index = map.get(entry.target);
        //   console.log(index, "index");
        console.log(entry);
        if (
          entry.boundingClientRect.bottom >= 0 &&
          entry.intersectionRatio === 1
        ) {
          const index = map.get(entry.target);
          if (scrollYDirection === "down" && index < currentIndex.value) return;
          currentIndex.value = index;
        } else if (
          scrollYDirection === "up" &&
          entry.intersectionRatio > 0.95 &&
          entry.boundingClientRect.bottom >= window.innerHeight
        ) {
          const index = map.get(entry.target);
          currentIndex.value = index >= 1 ? index - 1 : index;
          //   console.log("ddddddddd", index, " :2");
        }
      }

      // 样式的变化
      if (entry.intersectionRatio > 0.9) {
        entry.target.style.opacity = 1;
        entry.target.style.filter = "grayscale(0%)";
        entry.target.style.transform = "none";
      } else if (entry.boundingClientRect.top >= 0) {
        entry.target.style.opacity = 0.7 + 0.3 * entry.intersectionRatio;
        entry.target.style.filter = `grayscale(100%)`;
        entry.target.style.transform = `scale(${
          0.75 + 0.25 * entry.intersectionRatio
        })`;
      }
    });
  },
  {
    threshold: [0, 0.1, 0.5, 0.75, 0.9, 1],
  }
);
const vSlide = {
  mounted: (el, binding) => {
    // console.log(el, binding);
    el.style.opacity = 0.7;
    el.style.filter = "grayscale(100%)";
    el.style.transform = "scale(0.75)";
    el.style.transformOrigin = "center center";
    ob.observe(el);
    map.set(el, binding.value);
  },
  unmounted(el, binding) {
    ob.unobserve(el);
  },
};
function scrollLeftFn(e) {
  //   console.log(container.value.offsetTop, container.value.clientHeight);

  scrollYDirection = window.scrollY > scrollY ? "down" : "up";
  scrollY = window.scrollY;
  //   console.log("dd", scrollYDirection);
  const offsetTop = container.value.offsetTop;
  if (
    container.value.getBoundingClientRect().bottom <
    window.innerHeight + 50
  ) {
    console.log("离开容器");
    leftClassName.value = "p-bottom";
    // currentIndex.value = contanerList.value.length - 1;
  } else if (window.scrollY >= offsetTop - headerHeight.value) {
    console.log("进入容器");
    // console.log(window.scrollY - (offsetTop - headerHeight.value));
    // const scrollValue = window.scrollY - (offsetTop - headerHeight.value);
    // currentIndex.value = Math.floor(scrollValue / 250);
    leftClassName.value = "p-center";
  } else {
    leftClassName.value = "p-top";
    // currentIndex.value = 0;
    // console.log("没滑到容器");
  }
}

onMounted(() => {
  nextTick(() => {
    // console.log(container.value.offsetTop);
    document.addEventListener("scroll", scrollLeftFn);
  });
});
onUnmounted(() => {
  document.removeEventListener("scroll", scrollLeftFn);
});
</script>
<style scoped lang="scss">
h3 {
  font-size: 24px;
}
.container {
  display: flex;
  //   background-color: #000;
  
  .left {
    width: 500px;
    color: #fff;
    flex: 4;
    position: relative;
    .left-inner-container {
      position: absolute;
      width: 437px;
      top: 50px;
      left: 30px;
      // transform: translateX(-50%);
      h2 {
        font-size: 48px;
      }
      padding-left: 88px;
      .circle-container {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        .circle-item {
          width: 6px;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.4);
          margin-bottom: 24px;
          border-radius: 50%;
          &:last-child {
            margin-bottom: 0;
          }
          &.active {
            width: 14px;
            height: 14px;
            border: 1px solid rgba(255, 255, 255, 1);
            background: none;
          }
        }
      }
    }
    .history-item {
      .history-item__line {
        font-size: 24px;
        line-height: 34px;
        margin-top: 40px;
        margin-bottom: 24px;
        color: rgba(142, 142, 146, 1);
      }
      ul {
        li {
          font-size: 16px;
          line-height: 14px;
          margin-bottom: 16px;
          list-style: none;
          color: rgba(142, 142, 146, 1);
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
    .p-center {
      position: fixed;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
    .p-bottom {
      position: absolute;
      top: unset;
      bottom: 200px;
    }
  }
  .right {
    // padding: 120px 120px;
    border-left: 1px solid rgba(46, 47, 50, 1);
    color: #fff;
    flex: 6;
  }
  .right-container {
    margin: 0 auto;
    margin-bottom: 160px;
    font-size: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 24px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
@media (min-width: 2000px) {
  .container {
    .right {
      flex: 9;
    }
  }
}
@media (max-width: 768px) {
  
  .container{
    display: none;
  }
}
</style>
