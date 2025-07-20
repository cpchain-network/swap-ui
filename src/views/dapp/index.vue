<template>
    <div class="ecology-page">
        <div class="container">
            <div class="header">
                <div class="left">在CP Chain上 开发DAPP</div>
                <div class="right"></div>
            </div>
            <div class="filter-group">
                <button v-for="(item, idx) in filters" :key="item" :class="['filter-btn', { active: idx === activeIdx }]"
                    @click="activeIdx = idx">
                    {{ item }}
                </button>
            </div>

            <div class="center-content">
                <div class="center-text">
                    我们正在积极扩展生态，欢迎来部署你的第一个项目
                </div>
                <button class="join-btn">
                    加入孵化计划
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue'

const filters = ['全部', 'DEFI', '游戏', 'AI', '基础设施', '其他']
const activeIdx = ref(0)
</script>
  
<style lang="scss" scoped>
$bg-main: #111;
$green: #00CE7A;
$gray-btn: #1a1a1a;
$radius: 18px;
$btn-h: 36px;
$white: #fff;
$black: #1A1E1D;
$shadow: 0 2px 12px 0 rgba(22, 234, 144, 0.09);

.ecology-page {

    min-height: 100vh;
    background: $bg-main;
    color: $white;
    width: 100%;

    position: relative;

    //    display: flex;
    // align-items: center;
    // align-content: center;
    .container {
        .header {
            height: 460px;
            // 嗯background: red;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                color: #FFF;
                width: 40%;

                font-size: 56px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
            .right {
                width: 400px;  
                height:326px ;
                // background: #00CE7A;
            }
        }

        max-width: 1200px;
        // background: red;
        // height: 1000px;
        margin: 0 auto;
        padding-top: 90px;

        .filter-group {
            display: flex;
            gap: 16px;
            //   margin-top: 60px;
            // 行是的margin-left: 48px;

            .filter-btn {
                padding: 10px 15px;
                border-radius: 100px;
                border: none;
                background: $gray-btn;
                color: $white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: background 0.2s, color 0.2s;
                outline: none;

                &.active {
                    background: $green;
                    color: $black;
                }
            }
        }

        .center-content {
            padding: 80px 0好;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .center-text {
                color: #FFF;
                text-align: center;

                font-size: 24px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                margin-bottom: 250px;
                color: $white;
                text-align: center;
            }

            .join-btn {
                margin-top: 0;
                padding: 0 45px;
                height: $btn-h;
                line-height: $btn-h;
                border-radius: $radius;
                background: $green;
                color: $black;
                font-size: 14px;
                border: none;
                cursor: pointer;
                transition: filter 0.15s;
                box-shadow: $shadow;

                &:hover {
                    filter: brightness(0.98);
                }
            }
        }


    }

    @media (max-width: 768px) {
        .container {
            .filter-group {
                flex-wrap: wrap;
                margin-top: 24px;
                margin-left: 10px;
                gap: 10px;
            }

            .center-content {
                top: 28%;

                .center-text {
                    margin-bottom: 120px;
                    font-size: 15px;
                }
            }
        }
    }

}
</style>
  