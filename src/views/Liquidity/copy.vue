<template>
    <div id="Liquidity">
        <div class="contents">
            <h1>

                随添加V2流动性
            </h1>
            <div class="swap-card">
                <div class="opt">
                    <div class="btn" @click="selIcon(1, fromSymbol)">
                        <div class="item">
                            <img :src="fromIcon" class="icons">
                            <div class="name">{{ fromSymbol }}</div>
                        </div>
                        <div class="item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.5 6L7.99998 10.5L3.5 6" stroke="#8E8E92" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>


                    </div>
                    <div class="btn" @click="selIcon(2, toSymbol)">
                        <div class="item">
                            <img :src="toIcon" class="icons">
                            <div class="name">{{ toSymbol }}</div>
                        </div>
                        <div class="item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.5 6L7.99998 10.5L3.5 6" stroke="#8E8E92" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>

                </div>

                <div class="swap-row">
                    <div class="top"><img :src="fromIcon" alt="" class="icons">
                        <div class="name">{{ fromSymbol }}</div>
                    </div>
                    <div class="middle">
                        <input type="number" class="swap-amount-input" v-model.trim="amountIn">
                    </div>
                    <div class="bottom">
                        <div class="left">
                            <div class="percentItem" v-for="(item, index) in percentList" :key="index"
                                :class="[item == percentfromBalance ? 'active' : 'percentItem']"
                                @click="fromBalanceTab(item)">{{
                                    item }}%</div>
                        </div>
                        <div class="right">
                            余额 {{ trimTrailingZeros(fromBalance) }}
                        </div>
                    </div>
                </div>

                <div class="swap-row">
                    <div class="top"><img :src="toIcon" class="icons">
                        <div class="name">{{ toSymbol }}</div>
                    </div>
                    <div class="middle">
                        <input type="number" class="swap-amount-input"  v-model.trim="amountOut">
                    </div>
                    <div class="bottom">
                        <div class="left">
                            <div class="percentItem" v-for="(item, index) in percentList" :key="index"
                                :class="[item == percenttoBalance ? 'active' : 'percentItem']" @click="toBalanceTab(item)">
                                {{ item
                                }}%</div>
                        </div>
                        <div class="right">
                            余额 {{ trimTrailingZeros(toBalance) }}
                        </div>
                    </div>
                </div>

                <div class="swap-setting-row" @click="showModal = true">
                    <span class="setting-label"> {{ $t('swap.setSlip') }}</span>

                    <span class="setting-label">
                        {{ slippageInput }}

                        %
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3.5L10.5 8.00002L6 12.5" stroke="#8E8E92" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </span>

                </div>
                <button class="swap-main-btn" @click="sure()">
                    添加V2流动性</button>
            </div>
        </div>

        <!-- 弹窗 -->
        <SlippageModal v-model:value="slippage" :visible="showModal" @close="showModal = false"
            @confirm="onSlippageConfirm" />

        <TokenModal :visible="tokenModalVisible" :tokens="allAcconts" @select="handleSelect"
            @close="tokenModalVisible = false" />
    </div>
</template>

<script setup>

import { getPoolReserves, getSdkToken } from '../swap/uniswapQuote.js'

import ethIcon from '@/assets/coin/eth.png'
import daiIcon from '@/assets/coin/dai.png'
import usdtIcon from '@/assets/coin/usdt.png'
import usdcIcon from '@/assets/coin/usdc.svg'
import { BrowserProvider, Contract, parseUnits, formatUnits, MaxUint256, JsonRpcProvider } from 'ethers'
import cpIcon from "@/assets/coin/cp.svg"
import { ref, onMounted, watch, computed } from 'vue'
import SlippageModal from "./SlippageModal.vue"
import TokenModal from './tokenSelect.vue'
import { Pair, Route, Trade } from '@uniswap/v2-sdk'
import {
    CurrencyAmount, TradeType, Percent, Token
} from '@uniswap/sdk-core'
import {
    useChainId, useConnect, useDisconnect, useAccount,
    useWriteContract,
    useReadContract,
    useWaitForTransactionReceipt
} from '@wagmi/vue'
const { connect, connectors, error } = useConnect();
const { address, status } = useAccount()
const current = ref()
const allAcconts = ref([
    {
        symbol: 'CP', decimals: 18, token:
        {
            symbol: 'CP',
            decimals: 18,
            address: '',
            isNative: true,
            chainId: 86606
        }, icon: cpIcon, blance: 0, isNative: true,
    },

    { symbol: 'USDT', decimals: 18, token: new Token(86606, '0x6C255b22864bBC176431c42695D16f41576e5618', 18, 'USDT', 'Tether USD'), icon: usdtIcon, blance: 0, isNative: false },
    { symbol: 'USDC', decimals: 18, token: new Token(86606, '0xb884F1C92AF157dD3dcC54512a595b1D9531423d', 18, 'USDC', 'USD//C'), icon: usdcIcon, blance: 0, isNative: false },
])
const slippageInput = ref(0.5)
const showModal = ref(false)
let fromSymbol = ref('CP')
let toSymbol = ref("USDT")
const fromIcon = computed(() => {
    const acc = allAcconts.value.find(a => a.symbol === fromSymbol.value)
    return acc ? getIconUrl(acc.icon) : ''
})
const toIcon = computed(() => {
    const acc = allAcconts.value.find(a => a.symbol === toSymbol.value)
    return acc ? getIconUrl(acc.icon) : ''
})
const fromBalance = computed(() => {
    const acc = allAcconts.value.find(a => a.symbol === fromSymbol.value)
    return acc ? acc.blance : 0
})

//
const toBalance = computed(() => {
    const acc = allAcconts.value.find(a => a.symbol === toSymbol.value)
    return acc ? acc.blance : 0
})
const amountIn = ref()
const isfromprocess = ref(false)
const tofromprocess = ref(false)
const userAddress = ref('')
const connected = ref(false)
const amountOut = ref()
const tokenModalVisible = ref(false)
const percentList = [
    10,
    50,
    80,
    100
]
let provider;
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
]
function trimTrailingZeros(valueStr) {
    return String(valueStr).replace(/\.?0+$/, '')
}
function getIconUrl(icon) {
    // 这样写适配 Vite/Webpack
    return new URL(`${icon}`, import.meta.url).href
}

const percentfromBalance = ref()
const percenttoBalance = ref()
function fromBalanceTab(item) {
    percentfromBalance.value = item
    amountIn.value=  parseFloat(fromBalance.value) * item/100

}
function toBalanceTab(item) {
    percenttoBalance.value = item
    amountOut.value = parseFloat(toBalance.value)* item/100
}
function onSlippageConfirm(newVal) {
    // 这里可以做额外的处理，比如保存、请求等
    slippageInput.value = newVal
    // console.log('用户设置的新滑点：', newVal)
}
function selIcon(state, symbol) {

    tokenModalVisible.value = true
    current.value = state

}
function handleSelect(token) {
    const selectedSymbol = token.symbol
    const state = current.value

    if (state === 1) {
        if (selectedSymbol === toSymbol.value) {
            // ⚠️ 交换 from ↔ to
            const temp = fromSymbol.value
            fromSymbol.value = toSymbol.value
            toSymbol.value = temp
            return
        }
        fromSymbol.value = selectedSymbol
    }

    if (state === 2) {
        if (selectedSymbol === fromSymbol.value) {
            // ⚠️ 交换 from ↔ to
            const temp = fromSymbol.value
            fromSymbol.value = toSymbol.value
            toSymbol.value = temp
            return
        }
        toSymbol.value = selectedSymbol
    }
}
async function connectWallet() {




    if (status.value == "connected") {


        // const rpcUrl = 'https://cpchain.com' // 或其他 JSON-RPC 地址
        // provider =  new JsonRpcProvider('https://rpc-testnet.cpchain.com', 86606)
        provider = new JsonRpcProvider('https://rpc-testnet.cpchain.com', 86606)
        // await provider.send('eth_requestAccounts', [])

        // signer = await provider.getSigner()
        userAddress.value = address.value
        // userAddress.value = await signer.getAddress()
        connected.value = true
        var result = await fetchAllBalancesV6(provider, userAddress.value, allAcconts.value)
        console.log(result)
    }

}

async function fetchAllBalancesV6(provider, address, tokenList) {
    // 返回 Promise 数组
    isfromprocess.value = true
    tofromprocess.value = true
    const promises = tokenList.map(async (token) => {
        try {
            let raw
            if (token.isNative) {
                console.log(1)
                raw = await provider.getBalance(address)
            } else {
                const erc20 = new Contract(token.token.address, ERC20_ABI, provider)
                raw = await erc20.balanceOf(address)
            }
            token.blance = Number(formatUnits(raw, token.decimals)).toFixed(6)
        } catch (e) {
            token.blance = '0'
        }
    })
    await Promise.all(promises)
    // 强制响应式：重新赋值触发 UI 刷新
    allAcconts.value = [...allAcconts.value]
    console.log(allAcconts.value)
    isfromprocess.value = false
    tofromprocess.value = false
    return tokenList
}
watch(
    status,
    (newStatus) => {
        if (newStatus === "connected" || newStatus === "disconnected") {
            connectWallet()
        }
        if (newStatus === "disconnected") {
            amountIn.value = ''
            amountOut.value = ''
        }
    }
)
</script>

<style lang="scss" scoped>
#Liquidity {
    background: #121212 url("../../assets/faucet_bg.png") no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    min-height: 120vh;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;

    // padding-top: 100px;
    .contents {
        padding-bottom: 80px;

    }

    h1 {
        color: #FFF;
        text-align: center;

        font-size: 40px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        width: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 32px;
    }

    .swap-card {
        width: 480px;
        border-radius: 24px;
        background: var(---, #1E1E1E);
        border: 1.5px solid #222326;
        padding: 16px;
        position: relative;

        .opt {
            display: flex;
            justify-content: space-around;
            margin-bottom: 16px;

            .btn {
                height: 48px;
                padding: 0 16px;
                background: #FFF;
                width: calc(50% - 40px);
                border-radius: 100px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                cursor: pointer;

                .item {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .name {
                        color: var(--, #1A1E1D);
                        text-align: center;

                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }

                .icons {
                    width: 24px;
                    height: 24px;
                    margin-right: 8px;
                }

            }
        }

        .swap-row {
            border-radius: 20px;
            border: 1px solid #2E2F32;
            margin-bottom: 16px;
            padding: 16px;

            .top {
                height: 20px;
                display: flex;
                gap: 4px;
                align-items: center;

                img {
                    width: 16px;
                    height: 16px;
                }

                .name {
                    color: #FFF;

                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }

            }

            .middle {
                margin-top: 10px;
                height: 70px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;

                .swap-amount-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    outline: none;
                    font-size: 32px;
                    font-weight: 600;
                    width: 80%;
                    height: 100%;
                }

            }

            .bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left {
                    display: flex;
                    align-items: center;

                    .percentItem {
                        color: #8E8E92;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        padding: 4px 8px;
                        border-radius: 100px;
                        border: 1px solid #2E2F32;
                        margin-right: 4px;
                        cursor: pointer;
                    }

                    .active {
                        border: 1px solid #00CE7A;
                        color: #00CE7A;
                    }
                }

                .right {
                    color: #FFF;

                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
            }
        }

        .swap-setting-row {
            display: flex;
            height: 48px;
            padding: 0 16px;
            justify-content: space-between;
            border-radius: 100px;
            border: 1px solid #2E2F32;
            align-items: center;
            margin-bottom: 16px;

            .setting-label {
                color: #fff;
                font-size: 15px;
                font-weight: 500;
                display: flex;
                align-items: center;
            }

            .slip-btn {
                background: none;
                color: #fff;
                border: none;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            }
        }

        .swap-main-btn {
            width: 100%;
            height: 48px;
            border: none;
            border-radius: 100px;
            background: #2E2F32;
            color: #8E8E92;
            font-size: 16px;
            font-weight: 700;
            cursor: not-allowed;
            opacity: 0.75;
            margin-top: 4px;
            outline: none;

            &:not([disabled]) {
                background: #00CE7A;
                color: #1A1E1D;
                cursor: pointer;
                opacity: 1;
            }
        }

    }

}

/* Chrome、Safari、Edge、Opera */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type="number"] {
    -moz-appearance: textfield;
}

/* 可选：让 input 看起来像普通文本框（不是数字框） */
input[type="number"] {
    appearance: textfield;
    /* 兼容性需要自行权衡 */
}





@media (max-width: 768px) {
    #Liquidity {
        background: #121212 url("../../assets/faucet_bg.png") no-repeat;
        background-size: 100% 100%;
        width: 100vw;
        min-height: 120vh;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;

        padding-top: 60px;

        .contents {
            padding-bottom: 80px;

        }

        h1 {
            color: #FFF;
            text-align: center;

            font-size: 24px;
            margin-bottom: 24px;

            font-style: normal;
            font-weight: 600;
            line-height: normal;
            width: 100%;


        }

        .swap-card {
            width: 90vw;
            border-radius: 24px;
            background: var(---, #1E1E1E);
            border: 1.5px solid #222326;
            padding: 16px;
            position: relative;

            .opt {
                display: flex;
                justify-content: space-around;
                margin-bottom: 16px;

                .btn {
                    height: 48px;
                    padding: 0 16px;
                    background: #FFF;
                    width: calc(50% - 40px);
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;

                    .item {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .name {
                            color: var(--, #1A1E1D);
                            text-align: center;

                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    .icons {
                        width: 24px;
                        height: 24px;
                        margin-right: 8px;
                    }

                }
            }

            .swap-row {
                border-radius: 20px;
                border: 1px solid #2E2F32;
                margin-bottom: 16px;
                padding: 16px;

                .top {
                    height: 20px;
                    display: flex;
                    gap: 4px;
                    align-items: center;

                    img {
                        width: 16px;
                        height: 16px;
                    }

                    .name {
                        color: #FFF;

                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }

                }

                .middle {
                    margin-top: 10px;
                    height: 70px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;

                    .swap-amount-input {
                        background: transparent;
                        border: none;
                        color: #fff;
                        outline: none;
                        font-size: 32px;
                        font-weight: 600;
                        width: 80%;
                        height: 100%;
                    }

                }

                .bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .left {
                        display: flex;
                        align-items: center;

                        .percentItem {
                            color: #8E8E92;
                            display: flex;
                            align-items: center;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            padding: 4px 8px;
                            border-radius: 100px;
                            border: 1px solid #2E2F32;
                            margin-right: 4px;
                            cursor: pointer;
                        }

                        .active {
                            border: 1px solid #00CE7A;
                            color: #00CE7A;
                        }
                    }

                    .right {
                        color: #FFF;

                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                    }
                }
            }

            .swap-setting-row {
                display: flex;
                height: 48px;
                padding: 0 16px;
                justify-content: space-between;
                border-radius: 100px;
                border: 1px solid #2E2F32;
                align-items: center;
                margin-bottom: 16px;

                .setting-label {
                    color: #fff;
                    font-size: 15px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                }

                .slip-btn {
                    background: none;
                    color: #fff;
                    border: none;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }
            }

            .swap-main-btn {
                width: 100%;
                height: 48px;
                border: none;
                border-radius: 100px;
                background: #2E2F32;
                color: #8E8E92;
                font-size: 16px;
                font-weight: 700;
                cursor: not-allowed;
                opacity: 0.75;
                margin-top: 4px;
                outline: none;

                &:not([disabled]) {
                    background: #00CE7A;
                    color: #1A1E1D;
                    cursor: pointer;
                    opacity: 1;
                }
            }

        }

    }

}
</style>
