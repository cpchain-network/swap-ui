<template>
  <div class="blockFour">
    <el-row :gutter="10" class="wow animate__fadeInDown" data-wow-delay="0.5s">
      <el-col :xs="24" :sm="2" class="orders-1-xs">
        <div class="icons">
          <b v-for="(item,index) in 3" :key="item" :class="{ active: index == active }" 
           ></b>
        </div>
      </el-col>
      <el-col :xs="24" :sm="9" class="orders-2-xs">
        <div class="intro wow animate__fadeInUp">
          <h3> {{ $t('blockFour.title') }}</h3>
          <!-- <transition name="fade"> -->

          <div v-if="active == 0">

            <h4>{{ $t('blockFour.Q1.title') }}</h4>
            <ul>
              <li>{{ $t('blockFour.Q1.name1') }}</li>
              <li>{{ $t('blockFour.Q1.name2') }}</li>
              <li>{{ $t('blockFour.Q1.name3') }}</li>
            </ul>
          </div>
          <div v-if="active == 1">

            <h4>{{ $t('blockFour.Q2.title') }}</h4>
            <ul>
              <li>{{ $t('blockFour.Q2.name1') }}</li>
              <li>{{ $t('blockFour.Q2.name2') }}</li>
              <li>{{ $t('blockFour.Q2.name3') }}</li>
            </ul>
          </div>
          <div v-if="active == 2">

            <h4>{{ $t('blockFour.Q3.title') }}</h4>
            <ul>
              <li>{{ $t('blockFour.Q3.name1') }}</li>
              <li>{{ $t('blockFour.Q3.name2') }}</li>
              <li>{{ $t('blockFour.Q3.name3') }}</li>
            </ul>
          </div>

        </div>
      </el-col>
      <el-col :xs="24" :sm="13" class="orders-3-xs">

        <swiperpic ref="swiperComp" @update:currentIndex="onIndexUpdate"/>

      </el-col>

    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import swiperpic from "@/components/swiper.vue"

const carouselDirection = ref('vertical'); // 默认方向是水平
const active = ref(0)
const swiperComp = ref(null)
function tab(item) {
  active.value = item
  

}

function onIndexUpdate(idx) {
  console.log(idx)
  active.value =idx
  // 也可以在此处直接调用 updateCurrent()
}
</script>

<style scoped  lang="scss">
.orders-1-xs {
  order: 1;
}

.orders-2-xs {
  order: 2;
}

.orders-3-xs {
  order: 3;
}

.blockFour {

  padding: 150px 15px;

  .icons {
    height: 100%;
    margin-top: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    b {
      width: 8px;
      height: 8px;
      background: #8E8E92;
      border-radius: 50%;
      display: block;
      margin: 10px;
      cursor: pointer;
    }

    .active {
      width: 8px;
      height: 8px;
      background: transparent !important;
      border-radius: 50%;
      border: 1px solid #8E8E92;
      display: block;
      margin: 10px;
      cursor: pointer;
    }
  }

  .intro {
    height: 100%;
    margin-top: 50%;
    overflow: hidden;

    h3 {
      color: #FFF;

      font-size: 48px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      margin-bottom: 30px;
    }

    h4 {
      color: #8E8E92;

      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      margin-bottom: 20px;
    }

    ul {
      list-style: none;

      li {
        color: #8E8E92;
        margin-bottom: 12px;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
}

@media (max-width: 768px) {
  .orders-1-xs {
    order: 3;
  }

  .orders-2-xs {
    order: 1;
  }

  .orders-3-xs {
    order: 2;
  }


  .blockFour {
    // background-image: url("../assets/images/star.png");
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    // height: 400px;
    padding: 50px 15px;

    .icons {
      margin-top: 80px;
      display: flex;
      flex-direction: row;
      justify-content: center;

      b {
        width: 8px;
        height: 8px;
        background: #8E8E92;
        border-radius: 50%;
        display: block;
        margin: 10px;
        cursor: pointer;
      }

      .active {
        width: 8px;
        height: 8px;
        background: transparent !important;
        border-radius: 50%;
        border: 1px solid #8E8E92;
        display: block;
        margin: 10px;
        cursor: pointer;
      }
    }

    .intro {
      overflow: hidden;
      height: 320px;
      margin-top: 5%;

      h3 {
        color: #FFF;

        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 30px;
      }

      h4 {
        color: #8E8E92;

        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 20px;
      }

      ul {
        list-style: none;

        li {
          color: #8E8E92;

          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>