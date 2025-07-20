<template>
    <div class="crosschain-bg">
      <!-- 顶部标题 -->
      <div class="crosschain-title">
        随随时随地<br>轻轻松松跨链
      </div>
  
      <div class="crosschain-card">
        <!-- 网络选择行 -->
        <div class="cc-row cc-network">
          <div class="cc-chain">
            <img class="cc-icon"  alt="ETH" />
            <div>
              <div class="cc-label">From</div>
              <div class="cc-name">Ethereum</div>
            </div>
          </div>
          <div class="cc-arrow"><span>→</span></div>
          <div class="cc-chain">
            <img class="cc-icon"  alt="CP" />
            <div>
              <div class="cc-label">To</div>
              <div class="cc-name">CP Chain</div>
            </div>
          </div>
        </div>
  
        <!-- 输入金额 -->
        <div class="cc-row cc-amount">
          <div class="cc-amount-num">
            0.01
            <div class="cc-amount-usd">$25.26</div>
          </div>
          <div class="cc-amount-side">
            <div class="cc-token">
              <span class="dot"></span>
              <span class="cc-token-name">CP</span>
              <svg width="14" height="14" viewBox="0 0 20 20" class="arrow-down"><path d="M6 8l4 4 4-4" stroke="#aaa" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </div>
            <div class="cc-available">可用 0.02741 ETH</div>
          </div>
        </div>
  
        <!-- 摘要 -->
        <div class="cc-row cc-summary">
          <img class="cc-icon"  alt="ETH" />
          <div class="cc-sum-main">
            <span class="cc-sum-amt">0.01ETH</span>
            <span class="cc-sum-usd">$25.26</span>
          </div>
          <div class="cc-sum-extra">
            <span class="cc-sum-fee">手续费 $0.9 (0.0005ETH)</span>
            <span class="cc-sum-time">~3 mins</span>
          </div>
        </div>
  
        <!-- 跨链按钮 -->
        <button class="cc-btn">跨链</button>
      </div>
    </div>
  </template>
  
  <script setup>
  // 可自行扩展功能逻辑
  </script>
  
  <style lang="scss" scoped>
  .crosschain-bg {
    min-height: 100vh;
    background: radial-gradient(ellipse at 70% 0%, #2c2d33 40%, #13161c 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 60px;
  }
  
  .crosschain-title {
    color: #fff;
    font-size: 2.1rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    line-height: 1.4;
    margin-bottom: 40px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.24);
  }
  
  .crosschain-card {
    background: #191c20;
    border-radius: 28px;
    box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);
    padding: 36px 32px 24px;
    width: 370px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  
  .cc-row {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  .cc-network {
    justify-content: space-between;
    padding-bottom: 10px;
    border-bottom: 1.5px solid #23262c;
  }
  
  .cc-chain {
    display: flex;
    align-items: center;
    gap: 12px;
  
    .cc-icon {
      width: 38px;
      height: 38px;
      background: #181a1f;
      border-radius: 50%;
      box-shadow: 0 2px 10px 0 #2225 inset;
      object-fit: contain;
    }
    .cc-label {
      color: #9ca4b0;
      font-size: 0.98rem;
    }
    .cc-name {
      color: #fff;
      font-size: 1.12rem;
      font-weight: 500;
    }
  }
  
  .cc-arrow {
    color: #20de8a;
    font-size: 1.5rem;
    padding: 0 14px;
    font-weight: bold;
    user-select: none;
  }
  
  .cc-amount {
    justify-content: space-between;
    padding: 14px 0 10px 0;
    border-bottom: 1.5px solid #23262c;
  
    .cc-amount-num {
      color: #fff;
      font-size: 2.1rem;
      font-weight: 600;
      line-height: 1;
      letter-spacing: 2px;
  
      .cc-amount-usd {
        color: #8c98a6;
        font-size: 1.01rem;
        font-weight: 500;
        margin-top: 8px;
      }
    }
    .cc-amount-side {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 7px;
  
      .cc-token {
        display: flex;
        align-items: center;
        background: #16191f;
        border-radius: 16px;
        padding: 2px 12px 2px 8px;
        font-size: 1rem;
        color: #0ee681;
        font-weight: 600;
        gap: 4px;
        .dot {
          width: 9px;
          height: 9px;
          background: #18DF6B;
          border-radius: 50%;
          margin-right: 3px;
        }
        .cc-token-name {
          color: #0ee681;
          margin-right: 4px;
        }
        .arrow-down {
          margin-left: 2px;
          margin-top: 2px;
        }
      }
      .cc-available {
        color: #6d7788;
        font-size: 0.93rem;
      }
    }
  }
  
  .cc-summary {
    background: #1e2127;
    border-radius: 18px;
    padding: 13px 18px;
    gap: 13px;
    align-items: flex-start;
    min-height: 48px;
    margin-bottom: 6px;
  
    .cc-icon {
      width: 33px;
      height: 33px;
      margin-top: 1px;
    }
    .cc-sum-main {
      display: flex;
      flex-direction: column;
      gap: 3px;
      margin-right: 15px;
      .cc-sum-amt {
        color: #fff;
        font-size: 1.1rem;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .cc-sum-usd {
        color: #8c98a6;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    .cc-sum-extra {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;
      flex: 1;
      .cc-sum-fee {
        color: #8c98a6;
        font-size: 0.95rem;
      }
      .cc-sum-time {
        color: #7be7b8;
        font-size: 0.96rem;
        margin-top: 2px;
      }
    }
  }
  
  .cc-btn {
    margin-top: 8px;
    background: linear-gradient(90deg, #20de8a, #0ee681 80%);
    border: none;
    outline: none;
    border-radius: 16px;
    color: #111;
    font-size: 1.32rem;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 16px 0 14px 0;
    cursor: pointer;
    transition: background 0.16s;
    box-shadow: 0 4px 16px 0 #23ffaf40;
    width: 100%;
  
    &:hover {
      background: linear-gradient(90deg, #0ee681, #20de8a 90%);
      filter: brightness(0.96);
    }
  }
  
  /* 响应式 */
  @media (max-width: 480px) {
    .crosschain-card {
      width: 96vw;
      min-width: unset;
      padding: 22px 4vw 15px;
    }
    .crosschain-bg {
      padding-top: 32px;
    }
    .crosschain-title {
      font-size: 1.3rem;
      margin-bottom: 24px;
    }
  }
  </style>
  