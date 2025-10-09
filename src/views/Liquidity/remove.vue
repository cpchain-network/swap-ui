<template>
  <div v-if="visible" class="modal-mask">
    <div class="modal-box">
      <div class="modal-title">
        <span>{{ $t('liquidity.delliquidity') }}</span>
        <span class="close-btn" @click="close">×</span>
      </div>
      
      <!-- Percentage selection buttons -->
 
      
      <div class="modal-content">
        <input
          v-model="displayValue"
          type="text"
          class="modal-input"
          @input="handleInput"
          @blur="onBlur"
          @keydown.stop
          @keypress="onKeyPress"
          @paste.prevent
          placeholder=""
          autocomplete="off"
        />
        <!-- <span class="modal-unit">LP</span> -->
      </div>
      <div class="percentage-buttons">
        <div 
          v-for="percent in [10, 50,80, 100]" 
          :key="percent"
          :class="['percent-btn', { active: selectedPercent === percent }]"
          @click="selectPercent(percent)"
        >
          {{ percent }}%
        </div>
      </div>
      <div class="balance-info">
        <span> {{ $t('liquidity.balance') }}: {{ formattedMaxBalance }} </span>
      </div>
      
      <div v-if="warn" class="modal-warn">{{ warn }}</div>
      
      <button 
        class="modal-confirm" 
        @click="confirm"
        :disabled="!displayValue || parseFloat(displayValue) <= 0"
      >
      {{ $t('liquidity.delliquidity') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  maxBalance: {
    type: String,
    default: '0'
  }
})

const emits = defineEmits(['close', 'confirm'])

const displayValue = ref('')
const selectedPercent = ref(null)
const warn = ref('')

const maxBalanceNum = computed(() => {
  return parseFloat(props.maxBalance) || 0
})

// Add formatted maxBalance with 6 decimal places
const formattedMaxBalance = computed(() => {
  return maxBalanceNum.value.toFixed(6)
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    displayValue.value = ''
    selectedPercent.value = null
    warn.value = ''
  }
})

function close() {
  emits('close')
}

function selectPercent(percent) {
  selectedPercent.value = percent
  const amount = (maxBalanceNum.value * percent / 100).toFixed(6)
  displayValue.value = trimTrailingZeros(amount)
  warn.value = ''
}

function trimTrailingZeros(str) {
  return str.replace(/\.?0+$/, '')
}

function handleInput(e) {
  warn.value = ''
  selectedPercent.value = null // Clear percentage selection when manually inputting
  
  let val = e.target.value
  // Only allow numbers and decimal points
  val = val.replace(/[^\d.]/g, '')
  // Remove leading zeros
  val = val.replace(/^0+(\d)/, '$1')
  // Handle multiple decimal points
  val = val.replace(/\.{2,}/g, '.')
  val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  
  // Limit decimal places
  const parts = val.split('.')
  if (parts[1] && parts[1].length > 6) {
    parts[1] = parts[1].slice(0, 6)
  }
  val = parts.join('.')
  
  // Check if exceeds maximum balance
  if (val && parseFloat(val) > maxBalanceNum.value) {
    warn.value = `${t('liquidity.removeModel.exceedsMaxBalance')} ${formattedMaxBalance.value}`
    val = String(maxBalanceNum.value)
  }
  
  displayValue.value = val
}

function onBlur() {
  let val = displayValue.value
  if (val === '' || isNaN(Number(val))) {
    displayValue.value = ''
    return
  }
  
  let num = Number(val)
  if (num < 0) {
    warn.value = t('liquidity.removeModel.amountCannotBeNegative')
    num = 0
  } else if (num > maxBalanceNum.value) {
    warn.value = `${t('liquidity.removeModel.exceedsMaxBalance')} ${formattedMaxBalance.value}`
    num = maxBalanceNum.value
  }
  
  displayValue.value = num > 0 ? trimTrailingZeros(num.toFixed(6)) : ''
}

function onKeyPress(e) {
  const char = String.fromCharCode(e.which)
  if (!/[0-9.]/.test(char)) {
    e.preventDefault()
  }
}

function confirm() {
  let val = displayValue.value
  if (val === '' || isNaN(Number(val))) {
    warn.value = t('liquidity.removeModel.pleaseEnterValidAmount')
    return
  }
  
  let num = Number(val)
  if (num <= 0) {
    warn.value = t('liquidity.removeModel.amountMustBeGreaterThanZero')
    return
  }
  
  if (num > maxBalanceNum.value) {
    warn.value = `${t('liquidity.removeModel.exceedsMaxBalance')} ${formattedMaxBalance.value}`
    return
  }
  
  emits('confirm', num)
  emits('close')
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-box {
    background: #151517;
    border-radius: 16px;
    min-width: 280px;
    min-height: 180px;
    box-shadow: 0 6px 40px #0009;
    padding: 20px 18px 16px 18px;
    display: flex;
    flex-direction: column;
    
    .modal-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      color: #fff;
      margin-bottom: 18px;
      
      .close-btn {
        font-size: 20px;
        color: #888;
        cursor: pointer;
        line-height: 1;
        
        &:hover {
          color: #fff;
        }
      }
    }
    
    .percentage-buttons {
      display: flex;
      gap: 4px;
      padding-top: 15px;
      margin-bottom: 16px;
      
      .percent-btn {
        color: #8E8E92;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding: 4px 8px;
        border-radius: 100px;
        border: 1px solid #2E2F32;
        background: transparent;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
        
        &:hover {
          border-color: #00CE7A;
          color: #00CE7A;
        }
        
        &.active {
          border: 1px solid #00CE7A;
          color: #00CE7A;
          background: rgba(0, 206, 122, 0.1);
        }
      }
    }
    
    .modal-content {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      background: #101012;
      border-radius: 8px;
      padding: 0 10px;
      border: 1px solid #222;
      
      .modal-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 18px;
        outline: none;
        padding: 12px 0;
        text-align: left;
        
        &::placeholder {
          color: #555;
        }
      }
      
      .modal-unit {
        color: #555;
        margin-left: 4px;
        font-size: 16px;
      }
    }
    
    .balance-info {
      color: #888;
      font-size: 12px;
      margin-bottom: 10px;
      text-align: right;
    }
    
    .modal-warn {
      color: #ffca6f;
      font-size: 13px;
      padding: 2px 0 8px 0;
      min-height: 16px;
      text-align: left;
    }
    
    .modal-confirm {
      width: 100%;
      border-radius: 999px;
      border: none;
      height: 38px;
      background: #14e18d;
      color: #111;
      font-weight: bold;
      font-size: 16px;
      margin-top: 2px;
      cursor: pointer;
      transition: background 0.2s;
      
      &:hover:not(:disabled) {
        background: #00ce7a;
      }
      
      &:disabled {
        background: #333;
        color: #666;
        cursor: not-allowed;
      }
    }
  }
}
</style>