<template>
    <!-- 只在移动端显示轮播 -->
    <div class="swiper-mobile-only">
        <div class="intro">
            <h1>{{ $t('histroy.title') }}</h1>
            <ul>
                <li>
                    <h2>{{
                        images[active].title }}</h2>
                </li>
                <li v-for="item  in images[active].list">
                    <span>{{item}}</span>

                </li>
                
            </ul>
        </div>
        <Swiper :modules="modules" direction="horizontal" :slides-per-view="1" :space-between="10" :loop="false"
            class="swiper-custom" @slideChange="onSlideChange">
            <SwiperSlide v-for="(item, index) in images" :key="index" class="slide">
                <div class="imgcontainer">
                    <img :src="item.imageUrl" alt="">
                </div>
                <h3>{{ item.silde }}</h3>
            </SwiperSlide>
        </Swiper>

        <div class="activeList">
            <div v-for="(item,index) in   images.length" :class="{ active: index==active }">
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Mousewheel } from 'swiper/modules'
import 'swiper/css'
import { useI18n } from 'vue-i18n'
import { computed, ref } from "vue"
const emit = defineEmits(['update:currentIndex'])
const modules = [Mousewheel]

const { t } = useI18n()
const active = ref(0)
const images = computed(() =>
    [
        {
            title: t('histroy.blockOne.title'),
            silde: t('histroy.blockOne.silde'),
            imageUrl: new URL("@/assets/images/s3.png", import.meta.url).href,
            list: [
                t('histroy.blockOne.name1'),
                t('histroy.blockOne.name2'),
                t('histroy.blockOne.name3'),
                t('histroy.blockOne.name4'),
            ]
        },
        {
            title: t('histroy.blockTwo.title'),
            silde: t('histroy.blockTwo.silde'),
            imageUrl: new URL("@/assets/images/s1.png", import.meta.url).href,
            list: [
                t('histroy.blockTwo.name1'),
                t('histroy.blockTwo.name2'),
                t('histroy.blockTwo.name3'),
                t('histroy.blockTwo.name4'),
            ]
        },
        {
            title: t('histroy.blockThree.title'),
            silde: t('histroy.blockThree.silde'),
            imageUrl: new URL("@/assets/images/s2.png", import.meta.url).href,
            list: [
                t('histroy.blockThree.name1'),
                t('histroy.blockThree.name2'),
                t('histroy.blockThree.name3'),
                t('histroy.blockThree.name4'),
            ]
        }


    ]
)


function onSlideChange(swiper) {
    active.value = swiper.activeIndex
    console.log(swiper.activeIndex)
    // emit('update:currentIndex', swiper.activeIndex)
}
</script>
  
<style lang="scss" scoped>
.swiper-mobile-only {
    display: none;
}

@media (max-width: 768px) {
    .intro {
        padding: 0 15px;

        h1 {
            color: #FFF;

            font-size: 24px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            margin-bottom: 16px;
            
        }

        h2 {
            color: #8E8E92;

            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            margin-bottom: 8px;
        }

        ul {
            list-style: none;
            margin-bottom: 24px;
            min-height: 220px;

            li {
                color: #8E8E92;

                font-size: 14px;
                line-height: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                margin-bottom: 10px;
            }
        }
    }

    .activeList {
        height: 30px;
        display: flex;

        align-items: center;
        justify-content: center;
        gap: 24px;

        div {
            width: 6px;
            height: 6px;

            border-radius: 50%;
            background: rgb(113 113 113);
        }

        .active {
            width: 16px;

            height: 16px;
            background: transparent;
            border-radius: 50%;
            border: 1px solid rgb(113 113 113);
        }

    }

    .swiper-mobile-only {
        display: block;
    }

    .swiper-custom {
        width: 100vw;
        height: 290px;
        padding-bottom: 12px;
    }

    .slide {
        width: 100vw !important;
        min-width: 100vw;
        max-width: 100vw;
        height: 256px !important;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        background: none;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        margin: 0;
    }

    .imgcontainer {
        width: 95vw;
        /* 比slide稍微小一点留个padding感 */
        // max-width: 332px;
        height: 190px !important;
        border-radius: 24px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.4);

        img {
            height: 100%;
            width: auto;
        }
    }

    .slide h3 {
        margin: 0;
        padding: 0;
        font-size: 16px;
        color: #fff;
        text-align: center;
        font-weight: 400;
    }
}
</style>
  