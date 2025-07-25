<template>
    <div v-if="visible" class="modal-mask">
      <div class="modal-box">
        <div class="modal-title">
          <span>{{ $t('swap.setSliptitle') }}</span>
          <span class="close-btn" @click="close">×</span>
        </div>
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
            placeholder=" slippage (0.1~5)"
            autocomplete="off"
          />
          <span class="modal-percent">%</span>
        </div>
        <div v-if="warn" class="modal-warn">{{ warn }}</div>
        <button class="modal-confirm" @click="confirm">{{ $t('swap.sure') }}</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

const { t } = useI18n()
  const props = defineProps({
    visible: Boolean,
    value: Number,
  })
  const emits = defineEmits(['close', 'update:value', 'confirm'])
  
  const MIN = 0.1
  const MAX = 5
  const DEFAULT = 0.5
  
  const displayValue = ref(String(props.value ?? DEFAULT))
  const warn = ref('')
  
  watch(() => props.value, v => {
    displayValue.value = v !== undefined ? String(Number(v).toFixed(2)) : String(DEFAULT)
    warn.value = ''
  })
  
  function close() {
    emits('close')
  }
  
  function handleInput(e) {
    warn.value = ''
    let val = e.target.value
    // 只允许数字和1个小数点
    val = val.replace(/[^\d.]/g, '')
    val = val.replace(/^0+(\d)/, '$1') // 去掉前导0
    // 小数点只能一个
    val = val.replace(/\.{2,}/g, '.')
    val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    // 保留一位小数
    const parts = val.split('.')
    if (parts[1] && parts[1].length > 2) parts[1] = parts[1].slice(0, 2)
    val = parts.join('.')
    // 不允许小于0
    if (val && parseFloat(val) < 0) val = ''
    displayValue.value = val
    if (val && parseFloat(val) > MAX) {
      warn.value = `Maximum allowed is${MAX}%`
      displayValue.value = String(MAX)
    }
  }
  
  function onBlur() {
    let val = displayValue.value
    if (val === '' || isNaN(Number(val))) {
      displayValue.value = String(MIN)
      return
    }
    let num = Number(val)
    if (num < MIN) {
      warn.value = `Minimum allowed is${MIN}%`
      num = MIN
    } else if (num > MAX) {
      warn.value = `Maximum allowed is${MAX}%`
      num = MAX
    }
    displayValue.value = String(Number(num.toFixed(2)))
  }
  
  function onKeyPress(e) {
    // 只允许数字和一个小数点
    const char = String.fromCharCode(e.which)
    if (!/[0-9.]/.test(char)) {
      e.preventDefault()
    }
  }
  
  function confirm() {
    let val = displayValue.value
    if (val === '' || isNaN(Number(val))) {
      warn.value = '请输入有效数字'
      displayValue.value = String(MIN)
      return
    }
    let num = Number(val)
    if (num < MIN) {
      warn.value = `最小为${MIN}%`
      num = MIN
    }
    if (num > MAX) {
      warn.value = `最大只能为${MAX}%`
      num = MAX
    }
    num = Number(num.toFixed(2))
    displayValue.value = String(num)
    emits('update:value', num)
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
      min-width: 260px;
      min-height: 130px;
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
        }
      }
      .modal-content {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
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
        }
        .modal-percent {
          color: #555;
          margin-left: 4px;
          font-size: 16px;
        }
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
        &:hover { background: #00ce7a; }
      }
    }
  }
  </style>
  