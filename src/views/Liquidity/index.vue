<template>
    <div id="Liquidity">
        <div class="contents">
            <h1> {{ $t('liquidity.title') }}</h1>
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
                  
                    <div class="top">
                        <img :src="fromIcon" alt="" class="icons">
                        <div class="name">{{ fromSymbol }}</div>
                    </div>
                    <div class="middle">
                    
                        <input type="number" class="swap-amount-input" v-model.trim="amountIn" 
                         @input="onAmountInChange"
    @keypress="onKeyPress"
    @blur="onBlur('INPUT')"
                            :disabled="address==undefined||isCalculating" placeholder="0.0">
                        <div v-if="isCalculating && independentField === 'INPUT'" class="calculating-indicator">
                            {{ $t('liquidity.Calculat') }}...
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="left">
                            <div class="percentItem" v-for="(item, index) in percentList" :key="index"
                                :class="[item == percentfromBalance ? 'active' : 'percentItem']"
                                @click="fromBalanceTab(item)">{{ item }}%</div>
                        </div>
                        <div class="right">
                            {{ $t('liquidity.balance') }}: {{ trimTrailingZeros(fromBalance) }}
                        </div>
                    </div>
                </div>

                <div class="swap-row">
                    <div class="top">
                        <img :src="toIcon" class="icons">
                        <div class="name">{{ toSymbol }}</div>
                    </div>
                    <div class="middle">
                        <input type="number" class="swap-amount-input" v-model.trim="amountOut" 
                         @input="onAmountOutChange"
    @keypress="onKeyPress"
    @blur="onBlur('OUTPUT')"
                        :disabled="address==undefined||isCalculating"  placeholder="0.0">
                        <div v-if="isCalculating && independentField === 'OUTPUT'" class="calculating-indicator">
                            {{ $t('liquidity.Calculat') }}...
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="left">
                            <div class="percentItem" v-for="(item, index) in percentList" :key="index"
                                :class="[item == percenttoBalance ? 'active' : 'percentItem']" @click="toBalanceTab(item)">
                                {{ item }}%</div>
                        </div>
                        <div class="right">
                            {{ $t('liquidity.balance') }}: {{ trimTrailingZeros(toBalance) }}
                        </div>
                    </div>
                </div>

                <!-- 池子状态信息 -->
                <div v-if="poolStatus" class="pool-status">
                    <div v-if="poolStatus === 'new'" class="status-new">
                        {{ $t('liquidity.newCretate') }}
                    </div>
                    <div v-else-if="poolStatus === 'exists'" class="status-exists">
                        {{ $t('liquidity.addCreate') }}
                    </div>
                    <div v-else-if="poolStatus === 'error'" class="status-error">
                        {{ $t('liquidity.errorCreate') }}
                    </div>
                </div>

                <div class="swap-setting-row" @click="showModal = true">
                    <span class="setting-label">{{ $t('swap.setSlip') }}</span>
                    <span class="setting-label">
                        {{ slippageInput }}%
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 3.5L10.5 8.00002L6 12.5" stroke="#8E8E92" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </span>
                </div>
                <button class="swap-main-btn" v-if="!address" @click="connectWalleted()">
                    {{ buttonText }}
                </button>
                <button class="swap-main-btn" @click="sure()" :disabled="isProcess || !canAddLiquidity" v-else>
                    {{ buttonText }}
                </button>
            </div>
        </div>

        <!-- 弹窗 -->
        <SlippageModal v-model:value="slippage" :visible="showModal" @close="showModal = false"
            @confirm="onSlippageConfirm" />

        <TokenModal :visible="tokenModalVisible" :tokens="allAcconts" @select="handleSelect"
            @close="tokenModalVisible = false" />


        <div class="myPosition">
            <div class="container">
                <h3>{{ $t('liquidity.position') }}</h3>
                <table v-if="userBalances1.length > 0">
                    <thead>
                        <tr>
                            <th>{{ $t('liquidity.pool') }}</th>
                            <th>{{ $t('liquidity.token0') }}</th>
                            <th>{{ $t('liquidity.token1') }}</th>
                            <th>{{ $t('liquidity.APR') }}</th>
                            <th class="dis">{{ $t('liquidity.TVL') }}</th>
                            <th>{{ $t('liquidity.USERblance') }}</th>
                            <th>{{ $t('liquidity.Token0deposit') }}</th>
                            <th>{{ $t('liquidity.Token1deposit') }}</th>
                            <th>{{ $t('liquidity.PoolPercentage') }}</th>
                            <th>{{ $t('liquidity.operate') }}</th>
                        </tr>
                    </thead>
                    <tbody>

                        <tr v-for="item  in   filteredUserBalances">
                            <td>{{ item.name }}</td>
                            <td>{{ item.token0Symbol == 'WCP' ? 'CP' : item.token0Symbol }}</td>
                            <td>{{ item.token1Symbol }}</td>
                            <td>{{ item.apr }}</td>
                            <td class="dis">{{ item.tvl }}</td>

                            <td>{{ item.userPoolBalance }}</td>
                            <td>{{ item.token0Deposited }}</td>
                            <td>{{ item.token1Deposited }}</td>
                            <td>{{ item.poolTokenPercentage }}</td>
                            <td>

                                <el-button type="danger" link @click="del(item)">{{ $t('liquidity.del') }}</el-button>
                            </td>

                        </tr>
                    </tbody>
                </table>
                <ul v-for="item  in   filteredUserBalances">
                    <li>
                        <b>{{ $t('liquidity.pool') }}</b>
                        <span>{{ item.name }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.token0') }}</b>
                        <span>{{ item.token0Symbol == 'WCP' ? 'CP' : item.token0Symbol }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.token1') }}</b>
                        <span>{{ item.token1Symbol }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.APR') }}</b>
                        <span>{{ item.apr }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.TVL') }}</b>
                        <span>{{ item.tvl }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.USERblance') }}</b>
                        <span>{{ item.userPoolBalance }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.Token0deposit') }}</b>
                        <span>{{ item.token0Deposited }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.Token1deposit') }}</b>
                        <span>{{ item.token1Deposited }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.PoolPercentage') }}</b>
                        <span>{{ item.poolTokenPercentage }}</span>
                    </li>
                    <li>
                        <b class="sendName">{{ $t('liquidity.operate') }}</b>
                        <el-button type="danger" link @click="del(item)">{{ $t('liquidity.del') }}</el-button>
                    </li>
                </ul>
            </div>

        </div>

        <RemoveLiquidityModal :visible="showRemoveModal" :max-balance="lpBalance" @close="showRemoveModal = false"
            @confirm="handleRemoveLiquidity" />
    </div>
</template>

<script setup>
import ethIcon from '@/assets/coin/eth.png'
import daiIcon from '@/assets/coin/dai.png'
import usdtIcon from '@/assets/coin/usdt.png'
import usdcIcon from '@/assets/coin/usdc.svg'
import { BrowserProvider, Contract, parseUnits, formatUnits, MaxUint256, JsonRpcProvider } from 'ethers'
import cpIcon from "@/assets/coin/cp.svg"
import RemoveLiquidityModal from './remove.vue'
import { ref, onMounted, watch, computed, nextTick } from 'vue'
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
// 导入 uniswapQuote.js 中的函数
import { getPoolReserves, getSdkToken, isPairAvailable, getPairAddress } from '../swap/uniswapQuote.js'
import doAddLiquidity from './doAddLiquidity.js'
import { doRemoveLiquidity } from './doRemoveLiquidity.js'
import { useI18n } from 'vue-i18n'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

// 拿到 store
const counterStore = useCounterStore()
const { visible, isLogin } = storeToRefs(counterStore)
const { t } = useI18n()
const { connect, connectors, error } = useConnect();
const { address, status } = useAccount()
const current = ref()
const showRemoveModal = ref(false)
const lpBalance = ref(0)
const isProcess = ref(false)
const selItem = ref({})
const ROUTER_ADDRESS = '0x4cFBbe212366bf31DF01F5188d759c738a757509' // Uniswap V2 Router
const WRAPPED_CP_ADDRESS = '0xC18eA88732464dc5E38372A7Fb1d30b56Dd0E4d5' // WETH 地
// 代币配置
import { CPChainAPRCalculator } from "./lpTokenListManager.js"
const userBalances1 = ref([])
const filteredUserBalances = computed(() => {
    return userBalances1.value.filter(item => {
        const balance = parseFloat(item.userPoolBalance || '0')
        return balance > 0
    })
})
// import { generateLPTokenList } from '@/views/Liquidity/lpTokenListManager.js'
onMounted(async () => {
    // 创建实例

})

const MESSAGE_FIELDS = computed(() => ({
  // 基础进度提示
  progress_start: t('liquidity.MESSAGE_FIELDS.progress_start'),
  progress_validation: t('liquidity.MESSAGE_FIELDS.progress_validation'),
  progress_approval: t('liquidity.MESSAGE_FIELDS.progress_approval'),
  progress_transaction: t('liquidity.MESSAGE_FIELDS.progress_transaction'),
  progress_pending: t('liquidity.MESSAGE_FIELDS.progress_pending'),
  progress_success: t('liquidity.MESSAGE_FIELDS.progress_success'),
  progress_error: t('liquidity.MESSAGE_FIELDS.progress_error'),

  // 流动性池检查
  progress_pool_check_exists: t('liquidity.MESSAGE_FIELDS.progress_pool_check_exists'),
  progress_pool_check_new: t('liquidity.MESSAGE_FIELDS.progress_pool_check_new'),

  // 授权相关进度
  approval_check: t('liquidity.MESSAGE_FIELDS.approval_check'),
  approval_pending: t('liquidity.MESSAGE_FIELDS.approval_pending'),
  approval_confirming: t('liquidity.MESSAGE_FIELDS.approval_confirming'),
  approval_success: t('liquidity.MESSAGE_FIELDS.approval_success'),
  approval_sufficient: t('liquidity.MESSAGE_FIELDS.approval_sufficient'),
  approval_error: t('liquidity.MESSAGE_FIELDS.approval_error'),

  // ElMessage 提示信息
  authorization_submitted: t('liquidity.MESSAGE_FIELDS.authorization_submitted'),
  authorization_success: t('liquidity.MESSAGE_FIELDS.authorization_success'),
  liquidity_added_success: t('liquidity.MESSAGE_FIELDS.liquidity_added_success'),

  // 错误消息
  error_authorization_canceled: t('liquidity.MESSAGE_FIELDS.error_authorization_canceled'),
  error_authorization_failed: t('liquidity.MESSAGE_FIELDS.error_authorization_failed'),
  error_insufficient_token_balance: t('liquidity.MESSAGE_FIELDS.error_insufficient_token_balance'),
  error_transaction_failed: t('liquidity.MESSAGE_FIELDS.error_transaction_failed'),
  error_user_canceled: t('liquidity.MESSAGE_FIELDS.error_user_canceled'),
  error_insufficient_balance: t('liquidity.MESSAGE_FIELDS.error_insufficient_balance'),
  error_insufficient_a_amount: t('liquidity.MESSAGE_FIELDS.error_insufficient_a_amount'),
  error_insufficient_b_amount: t('liquidity.MESSAGE_FIELDS.error_insufficient_b_amount'),
  error_expired: t('liquidity.MESSAGE_FIELDS.error_expired'),
  error_identical_addresses: t('liquidity.MESSAGE_FIELDS.error_identical_addresses'),
  error_zero_address: t('liquidity.MESSAGE_FIELDS.error_zero_address'),
  error_timeout: t('liquidity.MESSAGE_FIELDS.error_timeout'),
  error_gas_estimation: t('liquidity.MESSAGE_FIELDS.error_gas_estimation')
}))

const MESSAGE_FIELDS2 = computed(() => ({
  // 基础进度提示
  startProgress: t('liquidity.MESSAGE_FIELDS2.startProgress'),
  validationProgress: t('liquidity.MESSAGE_FIELDS2.validationProgress'),
  poolInfoProgress: t('liquidity.MESSAGE_FIELDS2.poolInfoProgress'),
  approvalProgress: t('liquidity.MESSAGE_FIELDS2.approvalProgress'),
  transactionProgress: t('liquidity.MESSAGE_FIELDS2.transactionProgress'),
  pendingProgress: t('liquidity.MESSAGE_FIELDS2.pendingProgress'),
  successProgress: t('liquidity.MESSAGE_FIELDS2.successProgress'),
  errorProgress: t('liquidity.MESSAGE_FIELDS2.errorProgress'),

  // 参数验证相关
  incompleteParams: t('liquidity.MESSAGE_FIELDS2.incompleteParams'),
  incompleteTokenInfo: t('liquidity.MESSAGE_FIELDS2.incompleteTokenInfo'),
  invalidLPAmount: t('liquidity.MESSAGE_FIELDS2.invalidLPAmount'),
  invalidSlippage: t('liquidity.MESSAGE_FIELDS2.invalidSlippage'),

  // LP代币余额验证
  insufficientLPBalance: t('liquidity.MESSAGE_FIELDS2.insufficientLPBalance'),

  // 授权相关进度
  approvalCheck: t('liquidity.MESSAGE_FIELDS2.approvalCheck'),
  approvalPending: t('liquidity.MESSAGE_FIELDS2.approvalPending'),
  approvalSubmitted: t('liquidity.MESSAGE_FIELDS2.approvalSubmitted'),
  approvalConfirming: t('liquidity.MESSAGE_FIELDS2.approvalConfirming'),
  approvalSuccess: t('liquidity.MESSAGE_FIELDS2.approvalSuccess'),
  approvalSuccessProgress: t('liquidity.MESSAGE_FIELDS2.approvalSuccessProgress'),
  approvalSufficient: t('liquidity.MESSAGE_FIELDS2.approvalSufficient'),

  // ElMessage 提示信息
  successMessage: t('liquidity.MESSAGE_FIELDS2.successMessage'),

  // 错误消息
  userCancelledApproval: t('liquidity.MESSAGE_FIELDS2.userCancelledApproval'),
  approvalFailed: t('liquidity.MESSAGE_FIELDS2.approvalFailed'),
  approvalError: t('liquidity.MESSAGE_FIELDS2.approvalError'),
  transactionFailed: t('liquidity.MESSAGE_FIELDS2.transactionFailed'),
  userCancelled: t('liquidity.MESSAGE_FIELDS2.userCancelled'),
  insufficientBalance: t('liquidity.MESSAGE_FIELDS2.insufficientBalance'),
  insufficientLiquidity: t('liquidity.MESSAGE_FIELDS2.insufficientLiquidity'),
  insufficientAmountA: t('liquidity.MESSAGE_FIELDS2.insufficientAmountA'),
  insufficientAmountB: t('liquidity.MESSAGE_FIELDS2.insufficientAmountB'),
  transactionExpired: t('liquidity.MESSAGE_FIELDS2.transactionExpired'),
  transactionTimeout: t('liquidity.MESSAGE_FIELDS2.transactionTimeout'),
  gasEstimationFailed: t('liquidity.MESSAGE_FIELDS2.gasEstimationFailed')
}))
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
const mapAcconts = {
    USDT: new Token(86606, '0x6C255b22864bBC176431c42695D16f41576e5618', 18, 'USDT', 'Tether USD'),
    USDC: new Token(86606, '0xb884F1C92AF157dD3dcC54512a595b1D9531423d', 18, 'USDC', 'USD//C'),
    WCP: new Token(86606, '0xC18eA88732464dc5E38372A7Fb1d30b56Dd0E4d5', 18, 'WCP', 'Wrapped CP')
}

// 基础状态
const slippageInput = ref(0.5)
const showModal = ref(false)
let fromSymbol = ref('CP')
let toSymbol = ref("USDT")
const amountIn = ref('')
const amountOut = ref('')
const tokenModalVisible = ref(false)
const percentList = [10, 50, 80, 100]
const percentfromBalance = ref()
const percenttoBalance = ref()

// 新增状态变量
const isCalculating = ref(false)
const poolExists = ref(false)
const independentField = ref('') // 'INPUT' 或 'OUTPUT'
const noLiquidity = ref(false)
const poolStatus = ref('') // 'new', 'exists', 'error'
const calculationError = ref('')

// 连接状态
const isfromprocess = ref(false)
const tofromprocess = ref(false)
const userAddress = ref('')
const connected = ref(false)
let provider;

// 计算属性
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

const toBalance = computed(() => {
    const acc = allAcconts.value.find(a => a.symbol === toSymbol.value)
    return acc ? acc.blance : 0
})

// 按钮状态计算
const canAddLiquidity = computed(() => {
    if (!connected.value) return false
    if (isCalculating.value) return false
    if (!amountIn.value || !amountOut.value) return false
    if (parseFloat(amountIn.value) <= 0 || parseFloat(amountOut.value) <= 0) return false
    if (parseFloat(amountIn.value) > parseFloat(fromBalance.value)) return false
    if (parseFloat(amountOut.value) > parseFloat(toBalance.value)) return false

    return true
})

const buttonText = computed(() => {
    if (!connected.value) return t('liquidity.link')
    if (isCalculating.value) return t('liquidity.Calculat')
    if (!amountIn.value || !amountOut.value) return t('liquidity.enter')
    if (parseFloat(amountIn.value) > parseFloat(fromBalance.value)) return `${fromSymbol.value}  ${t('liquidity.Insufficient')}`
    if (parseFloat(amountOut.value) > parseFloat(toBalance.value)) return `${toSymbol.value}  ${t('liquidity.Insufficient')}`
    if (poolStatus.value === 'new') return t('liquidity.create')
    return t('liquidity.title')
})

// ERC20 ABI
const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
]

function connectWalleted() {

    if (!address.value) {

        isLogin.value = true


    }

}
function del(item) {
    showRemoveModal.value = true
    lpBalance.value = item.lptokenNum
    selItem.value = item
}
// 防抖函数
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// 核心计算函数：基于池子比例计算对应代币数量
async function calculateCorrespondingAmount(inputAmount, inputField) {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
        if (inputField === 'INPUT') {
            amountOut.value = ''
        } else {
            amountIn.value = ''
        }
        poolStatus.value = ''
        return
    }

    if (!provider || !connected.value) {
        calculationError.value = '请先连接钱包'
        return
    }

    try {
        isCalculating.value = true
        calculationError.value = ''

        // 获取池子储备量
        const reserves = await getPoolReserves({
            fromSymbol: fromSymbol.value,
            toSymbol: toSymbol.value,
            provider
        })

        // 检查是否为新池子
        if (reserves.fromReserve === 0 && reserves.toReserve === 0) {
            noLiquidity.value = true
            poolExists.value = false
            poolStatus.value = 'new'

            // 新池子情况下，用户可以设置任意比例
            // 不进行自动计算，让用户自由输入
            return
        }

        poolExists.value = true
        noLiquidity.value = false
        poolStatus.value = 'exists'

        // 基于池子比例计算
        const ratio = reserves.toReserve / reserves.fromReserve

        if (inputField === 'INPUT') {
            // 用户输入了 fromToken 数量，计算 toToken 数量
            const calculatedAmount = parseFloat(inputAmount) * ratio
            amountOut.value = calculatedAmount.toFixed(6)
        } else {
            // 用户输入了 toToken 数量，计算 fromToken 数量
            const calculatedAmount = parseFloat(inputAmount) / ratio
            amountIn.value = calculatedAmount.toFixed(6)
        }

    } catch (error) {
        console.error('计算失败:', error)
        calculationError.value = '计算失败，请重试'
        poolStatus.value = 'error'
    } finally {
        isCalculating.value = false
    }
}

// 防抖的计算函数
const debouncedCalculateFromInput = debounce((amount) => {
    calculateCorrespondingAmount(amount, 'INPUT')
}, 500)

const debouncedCalculateFromOutput = debounce((amount) => {
    calculateCorrespondingAmount(amount, 'OUTPUT')
}, 500)

// 输入监听函数
// function onAmountInChange() {
//     if (independentField.value !== 'INPUT') {
//         independentField.value = 'INPUT'
//     }
//     debouncedCalculateFromInput(amountIn.value)
// }

// function onAmountOutChange() {
//     if (independentField.value !== 'OUTPUT') {
//         independentField.value = 'OUTPUT'
//     }
//     debouncedCalculateFromOutput(amountOut.value)
// }
// 数字输入验证函数
function validateAndCorrectAmount(value) {
    if (!value) return ''
    
    let correctedValue = value.toString()
    
    // 1. 移除非数字字符（除了小数点）
    correctedValue = correctedValue.replace(/[^0-9.]/g, '')
    
    // 2. 确保只有一个小数点
    const parts = correctedValue.split('.')
    if (parts.length > 2) {
        correctedValue = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // 3. 处理前导零
    if (correctedValue.match(/^0+[1-9]/)) {
        correctedValue = correctedValue.replace(/^0+/, '')
    } else if (correctedValue.match(/^0{2,}$/)) {
        correctedValue = '0'
    }
    
    // 4. 限制小数位数为8位
    if (correctedValue.includes('.')) {
        const [integer, decimal] = correctedValue.split('.')
        if (decimal && decimal.length > 8) {
            correctedValue = integer + '.' + decimal.substring(0, 8)
        }
    }
    
    // 5. 确保不是负数
    if (correctedValue && !isNaN(parseFloat(correctedValue))) {
        const numValue = parseFloat(correctedValue)
        if (numValue < 0) {
            correctedValue = '0'
        }
    }
    
    // 6. 处理空字符串或无效输入
    if (correctedValue === '' || correctedValue === '.' || isNaN(parseFloat(correctedValue))) {
        return ''
    }
    
    return correctedValue
}

// 改进的输入监听函数
function onAmountInChange(event) {
    // 获取原始输入值
    const rawValue = event?.target?.value || amountIn.value
    
    // 验证和修正输入
    const correctedValue = validateAndCorrectAmount(rawValue)
    
    // 如果值发生了变化，更新输入框
    if (correctedValue !== amountIn.value) {
        amountIn.value = correctedValue
    }
    
    // 设置独立字段标识
    if (independentField.value !== 'INPUT') {
        independentField.value = 'INPUT'
    }
    
    // 如果输入为空或0，清空对应的输出
    if (!correctedValue || correctedValue === '0') {
        amountOut.value = ''
        return
    }
    
    // 触发计算
    debouncedCalculateFromInput(correctedValue)
}

function onAmountOutChange(event) {
    // 获取原始输入值
    const rawValue = event?.target?.value || amountOut.value
    
    // 验证和修正输入
    const correctedValue = validateAndCorrectAmount(rawValue)
    
    // 如果值发生了变化，更新输入框
    if (correctedValue !== amountOut.value) {
        amountOut.value = correctedValue
    }
    
    // 设置独立字段标识
    if (independentField.value !== 'OUTPUT') {
        independentField.value = 'OUTPUT'
    }
    
    // 如果输入为空或0，清空对应的输入
    if (!correctedValue || correctedValue === '0') {
        amountIn.value = ''
        return
    }
    
    // 触发计算
    debouncedCalculateFromOutput(correctedValue)
}

// 添加键盘事件处理，防止输入非法字符
function onKeyPress(event) {
    const char = String.fromCharCode(event.which)
    // 只允许数字和小数点
    if (!/[0-9.]/.test(char)) {
        event.preventDefault()
    }
    
    // 防止输入多个小数点
    const currentValue = event.target.value
    if (char === '.' && currentValue.includes('.')) {
        event.preventDefault()
    }
}

// 失焦时的最终验证
function onBlur(field) {
    const value = field === 'INPUT' ? amountIn.value : amountOut.value
    
    if (!value) return
    
    const numValue = parseFloat(value)
    
    // 检查是否为有效数字
    if (isNaN(numValue) || numValue < 0) {
        if (field === 'INPUT') {
            amountIn.value = ''
        } else {
            amountOut.value = ''
        }
        return
    }
    
    // 格式化数字（移除尾随零）
    const formattedValue = trimTrailingZeros(numValue.toFixed(8))
    
    if (field === 'INPUT') {
        amountIn.value = formattedValue
    } else {
        amountOut.value = formattedValue
    }
}
// 工具函数
function trimTrailingZeros(valueStr) {
    return String(valueStr).replace(/\.?0+$/, '')
}

function getIconUrl(icon) {
    return new URL(`${icon}`, import.meta.url).href
}

// 百分比选择函数（重新实现）
function fromBalanceTab(item) {
    percentfromBalance.value = item
    const calculatedAmount = parseFloat(fromBalance.value) * item / 100
    amountIn.value = calculatedAmount.toFixed(6)

    // 触发计算
    independentField.value = 'INPUT'
    debouncedCalculateFromInput(amountIn.value)
}

function toBalanceTab(item) {
    percenttoBalance.value = item
    const calculatedAmount = parseFloat(toBalance.value) * item / 100
    amountOut.value = calculatedAmount.toFixed(6)

    // 触发计算
    independentField.value = 'OUTPUT'
    debouncedCalculateFromOutput(amountOut.value)
}

// 滑点确认
function onSlippageConfirm(newVal) {
    slippageInput.value = newVal
}

// 代币选择
function selIcon(state, symbol) {
    tokenModalVisible.value = true
    current.value = state
}

function handleSelect(token) {
    const selectedSymbol = token.symbol
    const state = current.value

    if (state === 1) {
        if (selectedSymbol === toSymbol.value) {
            // 交换 from ↔ to
            const temp = fromSymbol.value
            fromSymbol.value = toSymbol.value
            toSymbol.value = temp
            return
        }
        fromSymbol.value = selectedSymbol
    }

    if (state === 2) {
        if (selectedSymbol === fromSymbol.value) {
            // 交换 from ↔ to
            const temp = fromSymbol.value
            fromSymbol.value = toSymbol.value
            toSymbol.value = temp
            return
        }
        toSymbol.value = selectedSymbol
    }

    // 代币变更后重新计算
    nextTick(() => {
        if (amountIn.value && independentField.value === 'INPUT') {
            debouncedCalculateFromInput(amountIn.value)
        } else if (amountOut.value && independentField.value === 'OUTPUT') {
            debouncedCalculateFromOutput(amountOut.value)
        }
    })
}

// 钱包连接
async function connectWallet() {
    if (status.value == "connected") {
        provider = new JsonRpcProvider('https://rpc-testnet.cpchain.com', 86606)
        userAddress.value = address.value
        connected.value = true
        var result = await fetchAllBalancesV6(provider, userAddress.value, allAcconts.value)
        console.log(result)

    }
}
async function handleRemoveLiquidity(amount) {
    console.log('选中的池子信息:', selItem.value)

    if (!selItem.value || !selItem.value.token0Symbol || !selItem.value.token1Symbol) {
        console.error('缺少池子信息')
        return
    }

    const poolInfo = selItem.value

    try {
        // 从 mapAcconts 获取代币信息
        const token0Info = mapAcconts[poolInfo.token0Symbol]
        const token1Info = mapAcconts[poolInfo.token1Symbol]

        if (!token0Info || !token1Info) {
            console.error('代币信息不完整:', {
                token0Symbol: poolInfo.token0Symbol,
                token1Symbol: poolInfo.token1Symbol,
                token0Info,
                token1Info
            })
            return
        }

        // 构建删除流动性参数
        const removeParams = {
            tokenA: {
                address: token0Info.address,
                symbol: poolInfo.token0Symbol === 'WCP' ? 'CP' : poolInfo.token0Symbol,
                decimals: token0Info.decimals
            },
            tokenB: {
                address: token1Info.address,
                symbol: poolInfo.token1Symbol,
                decimals: token1Info.decimals
            },
            liquidityAmount: amount.toString(),
            pairAddress: poolInfo.pairAddress || poolInfo.liquidityTokenAddress,
            slippageInput: slippageInput.value || 0.5,
            userAddress: address.value,
            routerAddress: ROUTER_ADDRESS,
            wcpAddress: WRAPPED_CP_ADDRESS,
            nativeSymbol: 'CP',
            setTxHash: (hash) => {
                console.log('交易哈希:', hash)
                // 可以在这里更新UI显示交易哈希
            },
            setApprovalHash: (hash) => {
                console.log('授权哈希:', hash)
                // 可以在这里更新UI显示授权哈希
            },
            onProgress: (stage, message, data) => {
                console.log(`进度更新 [${stage}]:`, message, data)
                // 可以在这里更新UI显示进度
            },
            messages: MESSAGE_FIELDS2.value // 传入国际化消息对象
        }

        console.log('删除流动性参数:', removeParams)

        // 调用删除流动性函数
        const result = await doRemoveLiquidity(removeParams)

        if (result.success) {
            console.log('删除流动性成功:', result)
            // 刷新用户余额

            // 关闭弹窗
            showRemoveModal.value = false
            // 清空选中项
            selItem.value = {}
            await fetchAllBalancesV6(provider, userAddress.value, allAcconts.value)
        } else {
            console.error('删除流动性失败:', result.error)
        }

    } catch (error) {
        console.error('删除流动性出错:', error)
    }
}
// 获取余额
async function fetchAllBalancesV6(provider, address, tokenList) {
    isfromprocess.value = true
    tofromprocess.value = true
    const promises = tokenList.map(async (token) => {
        try {
            let raw
            if (token.isNative) {
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
    allAcconts.value = [...allAcconts.value]
    console.log(allAcconts.value)
    isfromprocess.value = false
    tofromprocess.value = false
    const calculator = new CPChainAPRCalculator()
    const userBalances = await calculator.getUserAllLPBalances(address)
    userBalances1.value = userBalances
    return tokenList
}

// 添加流动性主函数


// ... existing code ...
// 添加流动性主函数
// ... existing code ...
async function sure() {
    if (!canAddLiquidity.value) return

    try {
        isProcess.value = true
        // 获取代币信息
        const fromToken = allAcconts.value.find(acc => acc.symbol === fromSymbol.value)
        const toToken = allAcconts.value.find(acc => acc.symbol === toSymbol.value)

        if (!fromToken || !toToken) {
            throw new Error('代币信息获取失败')
        }

        // 构建代币对象
        const tokenA = {
            address: fromToken.isNative ? WRAPPED_CP_ADDRESS : fromToken.token.address,
            decimals: fromToken.decimals,
            symbol: fromToken.symbol
        }

        const tokenB = {
            address: toToken.isNative ? WRAPPED_CP_ADDRESS : toToken.token.address,
            decimals: toToken.decimals,
            symbol: toToken.symbol
        }

        // 修复：正确的进度回调函数
        const onProgress = (stage, message) => {
            console.log(`交易状态 [${stage}]:`, message)
            // 这里可以添加 UI 状态更新逻辑
            switch (stage) {
                case 'start':
                    // 显示开始状态
                    break
                case 'validation':
                    // 显示验证状态
                    break
                case 'approval':
                    // 显示授权状态
                    break
                case 'transaction':
                    // 显示交易提交状态
                    break
                case 'pending':
                    // 显示等待确认状态
                    break
                case 'success':
                    // 显示完成状态
                    break
                case 'error':
                    // 显示错误状态
                    break
            }
        }

        // 修复：添加缺少的参数
        const result = await doAddLiquidity({
            tokenA,
            tokenB,
            amountA: amountIn.value,
            amountB: amountOut.value,
            slippageInput: slippageInput.value,
            userAddress: userAddress.value,
            routerAddress: ROUTER_ADDRESS,
            wcpAddress: WRAPPED_CP_ADDRESS,
            nativeSymbol: 'CP',  // 添加原生币符号
            setTxHash: (hash) => {
                console.log('Transaction hash:', hash)
                // 可以在这里更新 UI 显示交易哈希
            },
            setApprovalHash: (hash) => {
                console.log('Approval hash:', hash)
                // 可以在这里更新 UI 显示授权哈希
            },
            onProgress,
            messages: MESSAGE_FIELDS.value,  // 传入
        })

        console.log('添加流动性结果:', result)

        // 成功后的处理
        if (result.success) {
            // 清空输入
            amountIn.value = ''
            amountOut.value = ''

            // 刷新余额
            await fetchAllBalancesV6(provider, userAddress.value, allAcconts.value)

            // 显示成功消息
            // alert(`流动性添加成功！\n交易哈希: ${result.transactionHash}`)
        } else {
            // 处理失败情况
            throw new Error(result.error || '添加流动性失败')
        }

        isProcess.value = false

    } catch (error) {
        console.error('添加流动性失败:', error)

        // 改进的错误处理
        let errorMessage = '添加流动性失败'
        if (error.message.includes('用户取消') || error.message.includes('User rejected')) {
            errorMessage = '用户取消了交易'
        } else if (error.message.includes('余额不足') || error.message.includes('insufficient funds')) {
            errorMessage = '代币余额不足'
        } else if (error.message.includes('滑点')) {
            errorMessage = '滑点设置有误，请调整滑点容忍度'
        } else if (error.message.includes('INSUFFICIENT_A_AMOUNT')) {
            errorMessage = '代币A数量不足，请调整滑点或输入金额'
        } else if (error.message.includes('INSUFFICIENT_B_AMOUNT')) {
            errorMessage = '代币B数量不足，请调整滑点或输入金额'
        } else if (error.message.includes('timeout')) {
            errorMessage = '交易确认超时，请检查区块链浏览器'
        } else if (error.message) {
            errorMessage = error.message
        }
        isProcess.value = false
        // alert(errorMessage)
    }
}
// ... existing code ...
// 监听钱包状态变化
watch(
    status,
    (newStatus) => {
        if (newStatus === "connected" || newStatus === "disconnected") {
            connectWallet()
        }
        if (newStatus === "disconnected") {
            amountIn.value = ''
            amountOut.value = ''
            connected.value = false
            poolStatus.value = ''
            allAcconts.value.forEach(account => {
                account.blance = 0
            })
            userBalances1.value=[]
        }
    }
)

// 监听代币对变化
watch(
    [fromSymbol, toSymbol],
    () => {
        // 清空输入
        amountIn.value = ''
        amountOut.value = ''
        poolStatus.value = ''
        independentField.value = ''
        percentfromBalance.value = null
        percenttoBalance.value = null
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
    padding-top: 60px;

    .contents {
        padding-bottom: 30px;
    }

    .myPosition {
        width: 100%;
        display: flex;
        // align-items: center;
        justify-content: center;

        .container {
            flex: 1;
            max-width: 1200px;

            h3 {
                color: #fff;
                font-size: 24px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

            table {
                width: 100%;

                thead {
                    tr {
                        height: 64px;

                        th {
                            color: var(---, #8E8E92);
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal;
                            height: 40px;
                            text-align: left;
                            flex: 1;
                        }
                    }
                }

                tbody {
                    tr {
                        height: 64px;

                        td {
                            flex: 1;
                            color: #fff;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                        }
                    }
                }
            }

            ul {
                display: none;
            }


        }

    }

    @media (max-width: 768px) {
        .myPosition {
            width: 100%;
            display: flex;
            // align-items: center;
            justify-content: center;

            .container {
                flex: 1;
                padding: 0 15px;
                max-width: 1200px;

                h3 {
                    color: #fff;
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                }

                table {
                    width: 100%;
                    display: none;

                    thead {
                        tr {
                            height: 64px;

                            th {
                                color: var(---, #8E8E92);
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: normal;
                                height: 40px;
                                text-align: left;
                                flex: 1;
                            }
                        }
                    }

                    tbody {
                        tr {
                            height: 64px;

                            td {
                                flex: 1;
                                color: #fff;
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 500;
                                line-height: normal;
                            }
                        }
                    }
                }

                ul {
                    display: block;
                    list-style: none;
                    margin: 16px 0;
                    border-bottom: 0.5px solid #2E2F32;
                    ;

                    li:first-child {
                        height: 21px;
                        margin-bottom: 12px;
                    }

                    li {
                        display: flex;
                        margin-bottom: 8px;
                        justify-content: space-between;
                        align-items: center;

                        :deep(.el-button) {
                            font-size: 12px !important;
                        }

                        b {
                            color: #f3f5f6;
                            font-size: 15px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                        }

                        .sendName {
                            color: #8e8e92 !important;
                            font-size: 12px !important;
                            font-style: normal;
                            font-weight: 400 !important;
                            line-height: normal;
                        }

                        span {
                            color: #8e8e92;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 400;
                            line-height: normal
                        }
                    }
                }

            }

        }
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
            position: relative;

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
                position: relative;

                .swap-amount-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    outline: none;
                    font-size: 32px;
                    font-weight: 600;
                    width: 80%;
                    height: 100%;

                    &:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }
                }

                .calculating-indicator {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #00CE7A;
                    font-size: 14px;
                    font-weight: 500;
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
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: #00CE7A;
                            color: #00CE7A;
                        }
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

        // 池子状态信息样式
        .pool-status {
            margin-bottom: 16px;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;

            .status-new {
                background: rgba(255, 193, 7, 0.1);
                color: #FFC107;
                border: 1px solid rgba(255, 193, 7, 0.3);
            }

            .status-exists {
                background: rgba(0, 206, 122, 0.1);
                color: #00CE7A;
                border: 1px solid rgba(0, 206, 122, 0.3);
            }

            .status-error {
                background: rgba(220, 53, 69, 0.1);
                color: #DC3545;
                border: 1px solid rgba(220, 53, 69, 0.3);
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
            cursor: pointer;
            transition: border-color 0.2s ease;

            &:hover {
                border-color: #00CE7A;
            }

            .setting-label {
                color: #fff;
                font-size: 15px;
                font-weight: 500;
                display: flex;
                align-items: center;
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
            transition: all 0.2s ease;

            &:not([disabled]) {
                background: #00CE7A;
                color: #1A1E1D;
                cursor: pointer;
                opacity: 1;

                &:hover {
                    background: #00B569;
                }
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

/* 让 input 看起来像普通文本框 */
input[type="number"] {
    appearance: textfield;
}

@media (max-width: 768px) {
    #Liquidity {
        padding-top: 60px;

        .contents {
            padding-bottom: 30px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 24px;
        }

        .swap-card {
            width: 90vw;

            .opt {
                .btn {
                    .item {
                        .name {
                            font-size: 12px;
                        }
                    }

                    .icons {
                        width: 20px;
                        height: 20px;
                        margin-right: 6px;
                    }
                }
            }

            .swap-row {
                .middle {
                    .swap-amount-input {
                        font-size: 24px;
                    }

                    .calculating-indicator {
                        font-size: 12px;
                    }
                }

                .bottom {
                    .left {
                        .percentItem {
                            font-size: 10px;
                            padding: 3px 6px;
                        }
                    }

                    .right {
                        font-size: 12px;
                    }
                }
            }

            .pool-status {
                font-size: 12px;
                padding: 10px 12px;
            }

            .swap-setting-row {
                .setting-label {
                    font-size: 13px;
                }
            }

            .swap-main-btn {
                font-size: 14px;
            }
        }
    }
}
</style>