<template>
    <div class="blockOne">

        <bgTwo />
        <div class="content  wow animate__fadeInDown animate__delay-0.5s">
            <h3  v-html="cpChainLineBreak($t('blockOne.subTitle'))">
                
            </h3>


            <div class="tab">

              
                <button class="whiteBtn" @click="openPopup()">

                    <el-icon :style="{ color: iconColor, fontSize: iconSize + 'px' }">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.6673 10.6305C19.6673 15.6931 15.5633 19.7972 10.5007 19.7972M19.6673 10.6305C19.6673 5.56792 15.5633 1.46387 10.5007 1.46387M19.6673 10.6305C19.6673 9.11175 15.5633 7.88053 10.5007 7.88053C5.43804 7.88053 1.33398 9.11175 1.33398 10.6305M19.6673 10.6305C19.6673 12.1493 15.5633 13.3805 10.5007 13.3805C5.43804 13.3805 1.33398 12.1493 1.33398 10.6305M10.5007 19.7972C5.43804 19.7972 1.33398 15.6931 1.33398 10.6305M10.5007 19.7972C12.5257 19.7972 14.1673 15.6931 14.1673 10.6305C14.1673 5.56792 12.5257 1.46387 10.5007 1.46387M10.5007 19.7972C8.47561 19.7972 6.83398 15.6931 6.83398 10.6305C6.83398 5.56792 8.47561 1.46387 10.5007 1.46387M1.33398 10.6305C1.33398 5.56792 5.43804 1.46387 10.5007 1.46387"
                                stroke="currentColor" stroke-width="1.5" />
                        </svg>
                    </el-icon>
                    {{ $t('blockOne.whiteBtn') }}
                </button>
                <button class="transparentBTn" @click="openPopup()">
                    {{ $t('blockOne.transparentBTn') }}
                    <el-icon style="font-size:24px;">
                        <Right />
                    </el-icon>
                </button>
            </div>


        </div>

    </div>
</template>

<script setup>
import bgTwo from "@/components/bg2.vue"
const iconColor = "#000"; // 绿色
const iconSize = 20; // 图标的大小为 36px

import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

// 拿到 store
const counterStore = useCounterStore()
const { visible } = storeToRefs(counterStore)

// 挂载后让它自动打开
function cpChainLineBreak(str) {
  if (!str) return '';
  // 正则查找"cp chain"，忽略大小写
  const reg = /cp chain/i;
  const match = str.match(reg);
  if (match && match.index === 0) {
    // 从头匹配，首行为cp chain
    const endIdx = match[0].length;
    return match[0] + '<br>' + str.slice(endIdx).trim();
  }
  // 不是开头出现也可以处理：
  if (match) {
    const idx = match.index;
    const endIdx = idx + match[0].length;
    // 分成两行
    return str.slice(0, endIdx) + '<br>' + str.slice(endIdx).trim();
  }
  // 没有匹配就原样返回
  return str;
}

// 点击按钮／遮罩层的时候直接改 store.visible
function openPopup() {
    counterStore.visible = true
}
</script>

<style  scoped  lang="scss">
.clean-video {
    all: unset;
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    background-color: black;
    overflow: hidden;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    opacity: 0.5;
}

.blockOne {
    height: 100vh;
    width: 100%;
    position: relative;


    display: flex;
    align-items: center;
    justify-content: center;

    .content {
        // width: 922px;
        height: 205px;
        z-index: 20;
        // max-width: 1200px;

        h3 {

            font-weight: 450;
            font-size: 60px;
            line-height: 100%;
            letter-spacing: 0px;
            text-align: center;
            vertical-align: middle;
            color: #fff;
            line-height: 80px;

        }

        .tab {
            display: flex;
            width: 100%;
            margin-top: 48px;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;


            .transparentBTn:hover {
                cursor: pointer;
                border-radius: 1rem;
                border: 1px solid #FFF;
                display: flex;
                width: 240px;
                background: transparent;
                height: 56px;
                justify-content: center;
                align-items: center;
                gap: 0.08rem;
                flex-shrink: 0;

                color: #FFF;
                text-align: center;

                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                // margin-right: 0.3rem;
                transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                :deep(.el-icon) {
                    color: #fff;
                    transform: translateX(0);
                    /* 把 transition 放这里，常态生效，移入移出都用同一个动画 */
                    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                    will-change: transform;
                }
            }

            .transparentBTn {
                cursor: pointer;
                // border-radius: 1rem;

                border: 1px solid #00CE7A;

                color: #00CE7A;

                cursor: pointer;
                border-radius: 1rem;

                display: flex;
                width: 240px;
                background: transparent;
                height: 56px;
                justify-content: center;
                align-items: center;
                gap: 0.08rem;
                flex-shrink: 0;


                text-align: center;

                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
               

                :deep(.el-icon) {
                    color: #00CE7A;
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
                    transform: translateX(-5px);
                    margin-left: 8px;
                }
            }

            .whiteBtn:hover {
                cursor: pointer;
                border-radius: 1rem;
                border: 1px solid #FFF;
                display: flex;
                width: 240px;
                background: #fff;
                height: 56px;
                justify-content: center;
                align-items: center;
                gap: 0.08rem;
                flex-shrink: 0;

                color: #1F1F1F;
                text-align: center;

                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                :deep(.el-icon) {
                    
                    transform: translateX(0);
                    /* 把 transition 放这里，常态生效，移入移出都用同一个动画 */
                    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
                    will-change: transform;
                }
                
            }

            .whiteBtn {
                cursor: pointer;
                // border-radius: 1rem;

                border: 1px solid #00CE7A;


                background: #00CE7A;
                cursor: pointer;
                border-radius: 1rem;

                display: flex;
                width: 240px;

                height: 56px;
                justify-content: center;
                align-items: center;
                gap: 0.08rem;
                flex-shrink: 0;

                color: #1F1F1F;
                text-align: center;

                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
             margin-right: 20px;
                :deep(.el-icon) {
                    color: #00CE7A;
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
                    transform: translateX(5px);
                    margin-right: 8px;
                }
            }


        }


    }

}

@media (max-width: 768px) {
    .blockOne {
        height: 100vh;
        width: 100%;
        position: relative;


        display: flex;
        align-items: center;
        justify-content: center;

        .content {
            // width: 922px;
            width: calc(100% - 30px);
            height: 205px;
            // background: red;

            z-index: 20;

            h3 {

                font-weight: 450;
                font-size: 36px;
                line-height: 100%;
                letter-spacing: 0px;
                text-align: center;
                vertical-align: middle;
                color: #fff;

            }

            .tab {
                display: flex;
                width: 100%;
                margin-top: 48px;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;


                .transparentBTn {
                    cursor: pointer;
                    border-radius: 100px;

                    display: flex;
                    width: 100%;
                    background: transparent;
                    height: 56px;
                    justify-content: center;
                    align-items: center;
                    gap: 0.08rem;
                    flex-shrink: 0;

                    border: 1px solid #00CE7A;

                    color: #00CE7A;
                    text-align: center;

                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    margin-right: 0;
                    margin-bottom: 10px;
                }

                .transparentBTn:hover {
                    width: 100%;
                }

                .whiteBtn {
                    cursor: pointer;
                    border-radius: 100px;
                    border: 1px solid #00CE7A;


                    background: #00CE7A;
                    display: flex;
                    width: 100%;

                    height: 56px;
                    justify-content: center;
                    align-items: center;
                    gap: 0.08rem;
                    flex-shrink: 0;

                    color: #1F1F1F;
                    text-align: center;

                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    margin-right: 0;
                    margin-bottom: 30px;
                }

                .whiteBtn:hover {
                    width: 100%;
                }
            }


        }

    }

}
</style>