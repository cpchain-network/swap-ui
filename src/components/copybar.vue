<template>
    <div class="header">
      <div class="content" :style="headerStyle">
        <el-row>
          <el-col :xs="3" :sm="4" :md="5" :lg="9" :xl="11">
            <div class="gridContent">
              <img src="../assets/images/cpChain.png" alt="">
            </div>
          </el-col>
          <el-col :xs="21" :sm="20" :md="19" :lg="15" :xl="13">
            <div class="gridContent2">
  
              <div class="menu">
  
  
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                  style="background: transparent;" :ellipsis="false">
                  <el-sub-menu index="1">
                    <template #title> {{ $t('navbar.meun1.title') }}</template>
                    <el-menu-item index="1-1">{{ $t('navbar.meun1.menu.name1') }}</el-menu-item>
                    <el-menu-item index="1-2">{{ $t('navbar.meun1.menu.name2') }}</el-menu-item>
                    <el-menu-item index="1-3">{{ $t('navbar.meun1.menu.name3') }}</el-menu-item>
  
                  </el-sub-menu>
                  <el-sub-menu index="2">
                    <template #title>{{ $t('navbar.meun2.title') }}</template>
                    <el-menu-item index="2-1">{{ $t('navbar.meun2.menu.name1') }}</el-menu-item>
                    <el-menu-item index="2-2">{{ $t('navbar.meun2.menu.name2') }}</el-menu-item>
  
  
                  </el-sub-menu>
  
                  <el-sub-menu index="3">
                    <template #title>{{ $t('navbar.meun3.title') }}</template>
                    <el-menu-item index="3-1">{{ $t('navbar.meun3.menu.name1') }}</el-menu-item>
                    <el-menu-item index="3-2">{{ $t('navbar.meun3.menu.name2') }}</el-menu-item>
                    <el-menu-item index="3-3">{{ $t('navbar.meun3.menu.name3') }}</el-menu-item>
                    <el-menu-item index="3-4">{{ $t('navbar.meun3.menu.name4') }}</el-menu-item>
  
                    <el-menu-item index="3-5">{{ $t('navbar.meun3.menu.name5') }}</el-menu-item>
                  </el-sub-menu>
  
                  <el-menu-item index="4">{{ $t('navbar.meun4.title') }}</el-menu-item>
                  <el-menu-item index="5">{{ $t('navbar.meun5.title') }}</el-menu-item>
  
                  <el-sub-menu index="6">
                    <template #title>
                      <img src="@/assets/language.png" alt="" style="height: 20px;">
                    </template>
                    <el-menu-item index="6-1">{{ $t('navbar.language.cn') }}</el-menu-item>
                    <el-menu-item index="6-2" disabled>{{ $t('navbar.language.chFan') }}</el-menu-item>
                    <el-menu-item index="6-3">{{ $t('navbar.language.en') }}</el-menu-item>
                    <el-menu-item index="6-4" disabled>{{ $t('navbar.language.Vietnamese') }}</el-menu-item>
  
                    <el-menu-item index="6-5" disabled>{{ $t('navbar.language.Turkish') }}</el-menu-item>
  
                    <el-menu-item index="6-6" disabled>{{ $t('navbar.language.Korean') }}</el-menu-item>
  
                    <el-menu-item index="6-7" disabled>{{ $t('navbar.language.Japanese') }}</el-menu-item>
                  </el-sub-menu>
                  <button v-if="status != 'connected'" @click="showConnet = true">
  
                    {{ $t('navbar.link') }}
                  </button>
                  <button v-else @click="showExit = true">{{ shortAddress(address) }}</button>
                </el-menu>
              </div>
  
  
              <div class="menu1">
  
                <button v-if="status != 'connected'" @click="showConnet = true">
  
                  {{ $t('navbar.link') }}
                </button>
                <button v-else @click="showExit = true">{{ shortAddress(address) }}</button>
                <el-icon color="#fff" size="20" style="margin-left: 20px;cursor: pointer;" @click="drawer = true">
                  <Operation />
                </el-icon>
              </div>
  
            </div>
          </el-col>
        </el-row>
      </div>
      <el-drawer v-model="drawer" size="80%" :show-close="true">
        <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect" style="background: transparent;"
          :ellipsis="false">
          <el-sub-menu index="1">
                    <template #title> {{ $t('navbar.meun1.title') }}</template>
                    <el-menu-item index="1-1">{{ $t('navbar.meun1.menu.name1') }}</el-menu-item>
                    <el-menu-item index="1-2">{{ $t('navbar.meun1.menu.name2') }}</el-menu-item>
                    <el-menu-item index="1-3">{{ $t('navbar.meun1.menu.name3') }}</el-menu-item>
  
                  </el-sub-menu>
                  <el-sub-menu index="2">
                    <template #title>{{ $t('navbar.meun2.title') }}</template>
                    <el-menu-item index="2-1">{{ $t('navbar.meun2.menu.name1') }}</el-menu-item>
                    <el-menu-item index="2-2">{{ $t('navbar.meun2.menu.name2') }}</el-menu-item>
  
  
                  </el-sub-menu>
  
                  <el-sub-menu index="3">
                    <template #title>{{ $t('navbar.meun3.title') }}</template>
                    <el-menu-item index="3-1">{{ $t('navbar.meun3.menu.name1') }}</el-menu-item>
                    <el-menu-item index="3-2">{{ $t('navbar.meun3.menu.name2') }}</el-menu-item>
                    <el-menu-item index="3-3">{{ $t('navbar.meun3.menu.name3') }}</el-menu-item>
                    <el-menu-item index="3-4">{{ $t('navbar.meun3.menu.name4') }}</el-menu-item>
  
                    <el-menu-item index="3-5">{{ $t('navbar.meun3.menu.name5') }}</el-menu-item>
                  </el-sub-menu>
  
                  <el-menu-item index="4">{{ $t('navbar.meun4.title') }}</el-menu-item>
                  <el-menu-item index="5">{{ $t('navbar.meun5.title') }}</el-menu-item>
  
                  <el-sub-menu index="6">
                    <template #title>
                      <img src="@/assets/language.png" alt="" style="width: 20px;">
                    </template>
                    <el-menu-item index="6-1">{{ $t('navbar.language.cn') }}</el-menu-item>
                    <el-menu-item index="6-2" disabled>{{ $t('navbar.language.chFan') }}</el-menu-item>
                    <el-menu-item index="6-3">{{ $t('navbar.language.en') }}</el-menu-item>
                    <el-menu-item index="6-4" disabled>{{ $t('navbar.language.Vietnamese') }}</el-menu-item>
  
                    <el-menu-item index="6-5" disabled>{{ $t('navbar.language.Turkish') }}</el-menu-item>
  
                    <el-menu-item index="6-6" disabled>{{ $t('navbar.language.Korean') }}</el-menu-item>
  
                    <el-menu-item index="6-7" disabled>{{ $t('navbar.language.Japanese') }}</el-menu-item>
                  </el-sub-menu>
  
        </el-menu>
      </el-drawer>
      <transition name="fade">
        <div class="popup" v-if="showConnet">
  
          <div class="content1">
            <el-icon @click="showConnet = false">
              <CloseBold />
            </el-icon>
            <h3>{{ $t('link.titel') }}</h3>
            <ul>
              <li v-for="connector in connectors" :key="connector.id" @click="wallconnects(connector, chainId)">
  
  
                <img :src="connector.name == 'WalletConnect' ? img : connector.icon" alt="">
                <span> {{ connector.name }}</span>
              </li>
            </ul>
  
            <ul>
              <li>
  
  
                <!-- <button v-if="status !== 'disconnected'" type="button" @click="disconnect()">
                  Disconnect
                </button> -->
              </li>
            </ul>
          </div>
  
  
        </div>
      </transition>
  
  
      <transition name="fade">
        <div class="popup" v-if="showExit">
  
          <div class="content2">
            <el-icon @click="showExit = false">
              <CloseBold />
            </el-icon>
            <div>
  
              <div class="adds">
                {{ address }}
              </div>
              <div class="option">
                <div></div>
  
                <el-button link v-if="status !== 'disconnected'" @click="disconnectbtn()">
                  {{ $t('link.exit') }}
                </el-button>
  
              </div>
            </div>
          </div>
  
  
        </div>
      </transition>
  
  
  
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watchEffect, onBeforeUnmount, watch } from 'vue';
  import { useChainId, useConnect, useDisconnect, useAccount } from '@wagmi/vue'
  import { useI18n } from 'vue-i18n';
  
  const { locale } = useI18n();
  import img from "../assets/wallconnect.svg"
  const chainId = useChainId()
  const { connect, connectors, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { address, status } = useAccount()
  const dialogVisible = ref(true)
  // 控制 Drawer 的状态
  const drawer = ref(false);
  const shortAddress = (address) => {
    return `${address.slice(0, 6)}....${address.slice(-4)}`
  }
  const showConnet = ref(false)
  const showExit = ref(false)
  watch(status, (newStatus) => {
    console.log(newStatus)
    if (newStatus === 'connected') {
      showConnet.value = false
    }
  })
  console.log(connectors)
  // 存储当前滚动位置
  const scrollY = ref(0);
  
  function wallconnects(connector, chainId) {
  
    if (connector.name == "WalletConnect") {
      showConnet.value = false
    }
    connect({ connector, chainId })
    // @click="connect({ connector, chainId })"
  }
  function disconnectbtn() {
    disconnect()
    showExit.value = false
  }
  const newTop = ref()
  // 计算 header 的样式
  const headerStyle = ref({
    top: '0px', // Initial top position
    backgroundColor: 'rgba(18, 18, 18, 0)', // 初始透明背景色
    transition: 'background-color 0.3s ease', // 只保留背景色过渡效果
  });
  
  // 滚动事件处理函数
  const handleScroll = () => {
    scrollY.value = window.scrollY; // 获取当前滚动位置
  };
  
  // 监听滚动位置变化，修改 header 样式
  watchEffect(() => {
    // 背景色透明度：超过 150px 时背景色变深至不透明
    const opacity = scrollY.value > 70 ? 0.6 : scrollY.value / 70;
    const newTop = Math.min(scrollY.value / 2, 20); // top 最大值为 30px
    console.log(opacity)
    headerStyle.value = {
      backgroundColor: `rgba(18, 18, 18, ${opacity})`,
  
      transition: 'top 0.3s ease,background-color 0.3s ease',
      top: `${newTop}px`, // 动态设置 top
    };
  });
  
  // 页面加载完成后监听滚动事件
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  // 页面卸载前清除滚动事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  const handleSelect = (index) => {
     if(index=="6-3"){
    locale.value = "en-us" // 切
    document.documentElement.setAttribute('data-lang',  locale.value); 
     }
     if(index=="6-1"){
    locale.value = "zh-cn" // 切
    document.documentElement.setAttribute('data-lang',  locale.value); 
     }
    // console.log("选中的菜单项：", index);
  };
  </script>
  
  <style lang="scss" scoped>
  .popup {
    font-size: 14px;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    width: 100%;
    height: 100vh;
    color: #fff;
    background: rgb(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    // display: none;
  
    .content1 {
      width: 80%;
      height: 400px;
      max-width: 500px;
      background: #181818;
      border-radius: 20px;
      padding: 20px;
      position: relative;
      cursor: pointer;
  
      h3 {
        margin: 30px 0;
      }
  
      :deep(.el-icon) {
        position: absolute;
        right: 20px;
        top: 20px;
      }
  
      ul {
        list-style: none;
        cursor: pointer;
  
        li {
          height: 50px;
          display: flex;
          align-items: center;
  
          img {
            width: 30px;
            border-radius: 10px;
            /* 圆形头像 */
            object-fit: cover;
            /* 保证不变形 */
  
          }
  
          span {
            margin-left: 30px;
          }
        }
      }
    }
  
    .content2 {
      width: 30%;
      height: 100px;
      max-width: 500px;
      background: #181818;
      border-radius: 20px;
      padding: 20px;
      position: relative;
      cursor: pointer;
  
      :deep(.el-icon) {
        position: absolute;
        right: 20px;
        top: 20px;
      }
  
      :deep(.el-button) {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
  
      div {
        width: 100%
      }
  
      .adds {
        text-align: center;
        margin-top: 30px;
      }
  
  
  
    }
  
  }
  
  .header {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: center;
    position: absolute;
    z-index: 1000;
  
    :deep(.el-dialog) {
      --el-dialog-bg-color: #000 !important;
      z-index: 2000;
    }
  
    .content {
      height: 72px;
      width: auto;
      position: fixed;
      backdrop-filter: blur(10px);
      /* 固定在页面顶部 */
      top: 0px;
      // left: 0;
      // right: 0;
      // border-radius: 100px;
      // backdrop-filter: blur(14px);
      padding: 0 24px;
      // border-radius: 100px;
  
      .gridContent {
        height: 72px;
        display: flex;
        align-items: center;
        width: 100%;
  
        img {
          height: 30px;
        }
      }
  
      .gridContent2 {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
  
        img {
          height: 30px;
        }
  
        button {
          margin-top: 10px;
          cursor: pointer;
          display: flex;
          height: 35px;
          // padding: 0px 16px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: 100px;
          border: 1px solid #FFF;
          color: #FFF;
          width: 130px;
      
          font-size: 14px;
          font-weight: 500;
          background: transparent;
        }
  
        button:hover {
          cursor: pointer;
  
  
          border: 1px solid #00CE7A;
  
          color: #00CE7A;
  
  
  
  
        }
  
        .menu {
          display: block;
        }
  
        .menu1 {
          height: 44px;
          display: flex;
          align-items: center;
  
          img {
            height: 20px;
          }
  
          display: none;
        }
      }
    }
  
    @media (max-width: 1000px) {
      .content {
        height: 72px;
        // width: calc(100% - 100px);
        // border-radius: 100px;
        // backdrop-filter: blur(14px);
        padding: 0 24px;
        // border-radius: 100px;
      }
    }
  
    @media (max-width: 900px) {
  
      .popup {
        font-size: 14px;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
        width: 100%;
        height: 100vh;
        color: #fff;
        background: rgb(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        // display: none;
  
        .content1 {
          width: 80%;
          height: 400px;
          max-width: 500px;
          background: #181818;
          border-radius: 20px;
          padding: 20px;
          position: relative;
          cursor: pointer;
  
          h3 {
            margin: 30px 0;
          }
  
          :deep(.el-icon) {
            position: absolute;
            right: 20px;
            top: 20px;
          }
  
          ul {
            list-style: none;
            cursor: pointer;
  
            li {
              height: 50px;
              display: flex;
              align-items: center;
  
              img {
                width: 30px;
                border-radius: 10px;
                /* 圆形头像 */
                object-fit: cover;
                /* 保证不变形 */
  
              }
  
              span {
                margin-left: 30px;
              }
            }
          }
        }
  
        .content2 {
          width: 100%;
          height: 100px;
          max-width: 500px;
          background: #181818;
          border-radius: 20px;
          padding: 20px;
          position: relative;
          cursor: pointer;
  
          :deep(.el-icon) {
            position: absolute;
            right: 20px;
            top: 20px;
          }
  
          :deep(.el-button) {
            position: absolute;
            bottom: 20px;
            right: 20px;
          }
  
          div {
            width: 100%
          }
  
          .adds {
            // text-align: center;
            font-size: 12px;
            margin-top: 30px;
          }
  
  
  
        }
  
      }
  
      .content {
        height: 48px;
        width: calc(100% - 30px);
     
        backdrop-filter: blur(14px);
        // border-radius: 100px;
  
        .gridContent {
          height: 48px;
          display: flex;
          align-items: center;
          width: 100%;
  
          img {
            height: 20px;
          }
        }
  
        .gridContent2 {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
  
          img {
            height: 30px;
          }
  
          button {
            margin-top: 8px;
            cursor: pointer;
            display: flex;
            height: 44px;
            padding: 0px 16px;
            justify-content: center;
            align-items: center;
            gap: 10px;
            border-radius: 100px;
            border: 1px solid #FFF;
            color: #FFF;
        
            font-size: 16px;
            font-weight: 500;
            background: transparent;
          }
  
          .menu {
            display: none;
          }
  
          .menu1 {
            height: 44px;
            display: flex;
            align-items: center;
  
            img {
              height: 20px;
              margin-right: 10px;
            }
  
            button {
              margin-top: 0px !important;
              cursor: pointer;
              display: flex;
              height: 25px;
              justify-content: center;
              align-items: center;
              width: 100px;
               padding: 0 5px;
              border-radius: 100px;
              border: 1px solid #FFF;
              color: #FFF;
              font-family: "PingFang SC";
              font-size: 12px;
              font-weight: 500;
              background: transparent;
            }
  
            button:hover {
              cursor: pointer;
  
  
              border: 1px solid #00CE7A;
  
              color: #00CE7A;
  
  
  
  
            }
  
            :deep(.el-icon:hover) {
              color: #00CE7A;
            }
          }
        }
      }
    }
  }
  </style>
  