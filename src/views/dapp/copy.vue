<template>
    <div class="ecology-page">
        <!-- 顶部筛选按钮组 -->
        <div class="filter-group">
            <button v-for="(item, idx) in filters" :key="item" :class="['filter-btn', { active: idx === activeIdx }]"
                @click="activeIdx = idx">
                {{ item }}
            </button>
        </div>

        <!-- 居中提示文案 -->
        <div class="center-content">
            <div class="center-text">
                我们正在积极扩展生态，欢迎来部署你的第一个项目
            </div>
            <button class="join-btn">
                加入孵化计划
            </button>
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
$green: #16ea90;
$gray-btn: #1a1a1a;
$radius: 18px;
$btn-h: 36px;
$white: #fff;
$black: #111;
$shadow: 0 2px 12px 0 rgba(22, 234, 144, 0.09);

.ecology-page {
    min-height: 100vh;
    background: $bg-main;
    color: $white;
    font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
    position: relative;
    padding: 100px;

    .filter-group {
        display: flex;
        gap: 16px;
        //   margin-top: 60px;
        margin-left: 48px;

        .filter-btn {
            padding: 5px 18px;
            border-radius: $radius;
            border: none;
            background: $gray-btn;
            color: $white;
            font-size: 14px;
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
        position: absolute;
        left: 0;
        right: 0;
        top: 36%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .center-text {
            font-size: 18px;
            letter-spacing: 1px;
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

    @media (max-width: 600px) {
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
</style>
  