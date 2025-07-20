<template>
     <transition name="fade">
    <div class="token-modal" v-if="visible">
        <div class="modal-mask" @click="close"></div>
        <div class="modal-content">
            <div class="modal-header">
                <span>{{ $t('swap.selicons') }}</span>
                <span class="modal-close" @click="close">×</span>
            </div>
            <div class="search-box">
                <input v-model="search" :placeholder="$t('swap.searchicons')" />
            </div>
            <div class="token-list">
                <div class="token-list-title">{{ $t('swap.basicons') }}</div>
                <div v-for="token in filteredTokens" :key="token.symbol" class="token-item" @click="select(token)">
                    <img :src="getIcon(token.icon)" class="token-icon" />
                    <div class="token-info">
                        <div class="token-symbol">{{ token.symbol }}</div>
                        <div class="token-address">{{ formatAddress(token.token?.address) }}</div>
                    </div>
                    <div class="token-balance">{{ token.balance ?? token.blance }}</div>
                </div>
            </div>
        </div>
    </div>
</transition>
</template>
  
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    visible: Boolean,
    tokens: Array, // 你的 allAcconts 列表即可
    excludeSymbol: String, // 新增，用于过滤
})
const emit = defineEmits(['close', 'select'])
const search = ref('')

// 支持 balance 或 blance 字段兼容
const filteredTokens = computed(() => {
  let list = props.tokens
  if (props.excludeSymbol) {
    list = list.filter(token => token.symbol !== props.excludeSymbol)
  }
  if (!search.value) return list
  const keyword = search.value.trim().toLowerCase()
  return list.filter(token =>
    token.symbol.toLowerCase().includes(keyword) ||
    (token.token?.address && token.token.address.toLowerCase().includes(keyword))
  )
})

function select(token) {
    emit('select', token)
    emit('close')
}
function close() {
    emit('close')
}
function formatAddress(addr) {
    if (!addr) return ''
    return addr.slice(0, 6) + '...' + addr.slice(-4)
}
function getIcon(icon) {
    // 支持本地路径或线上路径
    try {
        return new URL(icon, import.meta.url).href
    } catch {
        return icon
    }
}
</script>
  
<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .24s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
.token-modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;

    .modal-mask {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 20%;
        width: 350px;
        background: #18191a;
        color: #fff;
        border-radius: 18px 0 0 18px;
        padding: 24px;
        height: 400px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, .3);
        animation: slideInRight .2s;
    }

    @keyframes slideInRight {
        from {
            right: -400px;
        }

        to {
            right: 0;
        }
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 20px;
        font-weight: bold;
        padding: 0 24px;
        height: 54px;
    }

    .modal-close {
        font-size: 28px;
        cursor: pointer;
        user-select: none;
        line-height: 1;
    }

    .search-box {
        padding: 0 20px;
        height:80px;
    }

    .search-box input {
        width: 90%;
        height: 38px;
        border: none;
        outline: none;
        // padding: 10px;
        padding: 0 20px;
        border-radius: 100px;
        background: #22232a;
        border: none;
        color: #fff;
        font-size: 16px;
    }

    .token-list-title {
        color: #8f9097;
        font-size: 13px;
        // padding: 0 20px 5px 20px;
   height: 35px;
        color: var(--, #8E8E92);
        text-align: left;
 display: flex;
 padding-left: 30px;
 align-items: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }

    .token-item {
        display: flex;
        align-items: center;
        padding: 0 20px;
        cursor: pointer;
        height: 64px;
        // border-bottom: 1px solid #22232a;
        transition: background .2s;

        &:hover {
            background: #212226;
        }

        .token-icon {
            width: 38px;
            height: 38px;
            margin-right: 8px;
            border-radius: 50%;
        }

        .token-info {
            flex: 1;
        }

        .token-symbol {
            font-weight: 600;
            text-align: left;
            font-size: 14px;
        }

        .token-address {
            color: var(---, #666868);


            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            text-align: left;
        }

        .token-balance {
            min-width: 56px;
            text-align: right;

            color: var(---, #FFF);
            text-align: center;

            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
    }
}
</style>
  