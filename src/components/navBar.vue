<template>
  <div class="header">
    <div class="content" :style="headerStyle">
      <el-row>
        <el-col :xs="3" :sm="4" :md="5" :lg="9" :xl="11">
          <div class="gridContent">
            <a href="/" class="flex"><img src="../assets/images/cpChain.png" alt="" /></a>
          </div>
        </el-col>
        <el-col :xs="21" :sm="20" :md="19" :lg="15" :xl="13">
          <div class="gridContent2">
            <div class="menu">
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                style="background: transparent" :ellipsis="false">

                <el-sub-menu index="6">
                  <template #title>
                    <img src="@/assets/language.png" alt="" style="height: 20px" />
                  </template>

                  <el-menu-item index="6-3">{{
                    $t("navbar.language.en")
                  }}</el-menu-item>
                  <el-menu-item index="6-1">{{
                    $t("navbar.language.cn")
                  }}</el-menu-item>
                </el-sub-menu>
                <!--  @click="showConnet = true" -->
                <button class="conentc-btn" v-if="status != 'connected'" @click="islogin()">
                  {{ $t("navbar.link") }}
                </button>
                <button v-else @click="showExit = true">
                  {{ shortAddress(address) }}
                </button>
              </el-menu>
            </div>

            <div class="menu1">
              <el-menu :default-active="activeIndex" class="el-menu-demo2" ref="menuRef" mode="horizontal"
                @select="handleSelect" style="background: transparent" :ellipsis="false">
                <el-sub-menu index="6">
                  <template #title>
                    <img src="@/assets/language.png" alt="" style="width: 20px" />
                  </template>
                  <el-menu-item index="6-3">{{
                    $t("navbar.language.en")
                  }}</el-menu-item>
                  <el-menu-item index="6-1">{{
                    $t("navbar.language.cn")
                  }}</el-menu-item>
                </el-sub-menu>
              </el-menu>
              <button v-if="status != 'connected'" @click="islogin()">
                {{ $t("navbar.link") }}
              </button>
              <button v-else @click="showExit = true">
                {{ shortAddress(address) }}
              </button>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-drawer v-model="drawer" size="80%" :show-close="true">
      <el-menu :default-active="activeIndex" class="el-menu-demo" @select="handleSelect" style="background: transparent"
        :ellipsis="false">
        <el-sub-menu v-for="(item, index) in menuList" :key="item.index" :index="item.index">
          <template #title> {{ item.title }}</template>
          <el-menu-item v-for="child in item.itemList" :key="child.index" :index="child.index">
            {{ child.name }}
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="5">{{ $t("navbar.meun5.title") }}</el-menu-item>
      </el-menu>
    </el-drawer>
    <transition name="fade">
      <div class="popup" v-if="showConnet">
        <div class="content1">
          <el-icon @click="closeLogin()">
            <CloseBold />
          </el-icon>
          <h3>{{ $t("link.titel") }}</h3>
          <ul>
            <li v-for="connector in wallets" :key="connector.id" @click="wallconnects(connector.id, chainId)">
              <span> {{ connector.name }}</span>
              <img :src="connector.name == 'WalletConnect' ? img : connector.icon" alt="" />

            </li>
          </ul>

          <div :class="['warning', { shake: isShaking }]" v-if="connectors.length > 1"> {{ $t("navbar.warining") }}</div>
        </div>

      </div>
    </transition>

    <transition name="fade">
      <div class="popup" v-if="showExit">
        <div class="content2">
          <span style="font-size: 20px;
font-style: normal;
font-weight: 500;
line-height: normal;color: #fff;">{{ status }}</span>
          <el-icon @click="showExit = false">
            <CloseBold />
          </el-icon>
          <div>
            <div class="adds">

              <img v-if="address" :src="`https://effigy.im/a/${address}.svg`" width="40" />
              <div class="shortAddress">

                <span>{{ shortAddress(address) }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  @click="copyToClipboard(address)">
                  <path
                    d="M8.8 9.3V7.7C8.8 5.93269 10.2327 4.5 12 4.5L16.8 4.5C18.5673 4.5 20 5.93269 20 7.7V12.5C20 14.2673 18.5673 15.7 16.8 15.7H15.2M8.8 9.3H7.2C5.43269 9.3 4 10.7327 4 12.5V17.3C4 19.0673 5.43269 20.5 7.2 20.5H12C13.7673 20.5 15.2 19.0673 15.2 17.3V15.7M8.8 9.3H12C13.7673 9.3 15.2 10.7327 15.2 12.5V15.7"
                    stroke="#8E8E92" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
              </div>

              <div class="exit">
                <div class="blances">
                  {{ balance }}CP
                </div>
                <button v-if="status !== 'disconnected'" @click="disconnectbtn()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                    <path d="M12.5 6L14.5 8M14.5 8L12.5 10M14.5 8H6.5" stroke="#8E8E92" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M10.5 5V4C10.5 2.89543 9.60457 2 8.5 2H4.5C3.39543 2 2.5 2.89543 2.5 4V12C2.5 13.1046 3.39543 14 4.5 14H8.5C9.60457 14 10.5 13.1046 10.5 12V11"
                      stroke="#8E8E92" stroke-linecap="round" stroke-linejoin="round" />
                  </svg> {{ $t("link.exit") }}
                </button>
              </div>

            </div>
            <!-- <div class="option">
              <div></div>

              <el-button link v-if="status !== 'disconnected'" @click="disconnectbtn()">
                {{ $t("link.exit") }}
              </el-button>
            </div> -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  watchEffect,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";
import { useChainId, useConnect, useDisconnect, useAccount } from "@wagmi/vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { JsonRpcProvider, formatEther } from 'ethers'
// import { useBalance  } from '@wagmi/core'
// import { generateBase64 } from 'ethereum-blockies-base64'
const router = useRouter();
const { locale, t } = useI18n();
import img from "../assets/wallconnect.svg";
const menuRef = ref();
const balance = ref('0')
const chainId = useChainId();
const { connect, connectors, error } = useConnect();
const { disconnect } = useDisconnect();
const { address, status } = useAccount();
// const images = computed(() => { })
import { useCounterStore } from "@/stores/counter";
import { storeToRefs } from "pinia";
const activeIndex = ref("1");
const isShaking = ref(false)
import { ElMessage } from 'element-plus'
// 拿到 store
const counterStore = useCounterStore();
const { visible, isLogin } = storeToRefs(counterStore);
const wallets = [
  {

    name: "TokenPocket",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzY4IiBoZWlnaHQ9Ijc2OCIgdmlld0JveD0iMCAwIDc2OCA3NjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI3NjgiIGhlaWdodD0iNzY4IiBmaWxsPSIjMjk4MEZFIi8+CjxwYXRoIGQ9Ik0zMjUuNDc5IDIxMi42NzZIMzIxLjk2MUgxMzQuMzI0QzEyNS4zODQgMjEyLjY3NiAxMTguMTU2IDIxOS45MDQgMTE4LjE1NiAyMjguODQzVjI5NC40NjRDMTE4LjE1NiAzMDMuNDAzIDEyNS4zODQgMzEwLjYzMSAxMzQuMzI0IDMxMC42MzFIMTc4LjM1NkgxOTUuODU1VjMzMC4wMzJWNTM3LjczNkMxOTUuODU1IDU0Ni42NzUgMjAzLjA4MyA1NTMuOTAzIDIxMi4wMjIgNTUzLjkwM0gyODAuODc2QzI4OS44MTYgNTUzLjkwMyAyOTcuMDQ0IDU0Ni42NzUgMjk3LjA0NCA1MzcuNzM2VjMzMC4wMzJWMzI4LjIyNVYzMTAuNjMxSDMxNC41NDNIMzIxLjY3NUgzMjUuMTk0QzM1Mi4yMDMgMzEwLjYzMSAzNzQuMTcyIDI4OC42NjMgMzc0LjE3MiAyNjEuNjU0QzM3NC40NTcgMjM0LjY0NCAzNTIuNDg5IDIxMi42NzYgMzI1LjQ3OSAyMTIuNjc2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTUxMS40OTggMjEyLjY3NkM0MzYuNzQ4IDIxMi42NzYgMzc2LjA3MiAyNzMuMzUxIDM3Ni4wNzIgMzQ4LjEwMlY1MzcuMjZDMzc2LjA3MiA1NDYuMiAzODMuMyA1NTMuNDI4IDM5Mi4yNCA1NTMuNDI4SDQ2NC43MDhDNDczLjY0NyA1NTMuNDI4IDQ4MC44NzUgNTQ2LjIgNDgwLjg3NSA1MzcuMjZWNDgwLjA4Mkw0ODAuOTcgNDgwLjEwNFYzNDguMTAyQzQ4MC45NyAzMzEuMjY4IDQ5NC42NjUgMzE3LjU3NCA1MTEuNDk4IDMxNy41NzRDNTI4LjMzMSAzMTcuNTc0IDU0Mi4wMjYgMzMxLjI2OCA1NDIuMDI2IDM0OC4xMDJDNTQyLjAyNiAzNjIuMjcyIDUzMi40MjEgMzc0LjE2IDUxOS4yOTYgMzc3LjU4M0M1MTYuODI0IDM3OC4yNDkgNTE0LjE2MSAzNzguNjI5IDUxMS40OTggMzc4LjYyOUM1MTAuNzcxIDM3OC42MjkgNTEwLjEzIDM3OC42MyA1MDkuNDEgMzc4LjU0N1YzNzguNTM0QzQ5My41MjggMzc3LjQ4OCA0ODAuOTc1IDM2NC4yNjkgNDgwLjk3NSAzNDguMTAyVjQ4MC4xMDRDNDg0LjU4OSA0ODAuOTYgNDg4LjI5OCA0ODEuNjI1IDQ5Mi4xMDIgNDgyLjE5NkM0OTcuNDI3IDQ4Mi45NTcgNTAyLjk0MyA0ODMuNDMyIDUwOC40NTkgNDgzLjUyN0w1MTEuNSA0ODMuNTI4QzUxNC4xNjIgNDgzLjUyOCA1MTYuNzI5IDQ4My40MzIgNTE5LjI5NiA0ODMuMzM3QzU5MC40MzMgNDc5LjI0OCA2NDYuOTI0IDQyMC4yODQgNjQ2LjkyNCAzNDguMTAyQzY0Ny4wMTkgMjczLjM1MSA1ODYuMzQ0IDIxMi42NzYgNTExLjQ5OCAyMTIuNjc2WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==",
    id: "https://www.tokenpocket.pro/en/download/app"
  },
  {

    name: "MetaMask",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNSAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjcwNzcgMzIuNzUyMkwyNS4xNjg4IDMwLjUxNzRMMTkuNDgzMyAzMy45MDA4TDE1LjUxNjcgMzMuODk5MUw5LjgyNzkzIDMwLjUxNzRMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDQ4OUwyLjI5MjI1IDE2LjQ5OTNMMCA5LjI3MDk0TDIuMjkyMjUgMC4zMTIyNTZMMTQuMDY3NCA3LjMxNTU0SDIwLjkzMjZMMzIuNzA3NyAwLjMxMjI1NkwzNSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0wzNSAyNS4wNDg5TDMyLjcwNzcgMzIuNzUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTIuMjkzOTUgMC4zMTIyNTZMMTQuMDY5MSA3LjMyMDQ3TDEzLjYwMDggMTIuMTMwMUwyLjI5Mzk1IDAuMzEyMjU2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNOS44Mjk1OSAyNS4wNTIyTDE1LjAxMDYgMjguOTgxMUw5LjgyOTU5IDMwLjUxNzVWMjUuMDUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTE0LjU5NjYgMTguNTU2NUwxMy42MDA5IDEyLjEzMzNMNy4yMjY5MiAxNi41MDA5TDcuMjIzNjMgMTYuNDk5M1YxNi41MDI1TDcuMjQzMzUgMjAuOTk4M0w5LjgyODA5IDE4LjU1NjVIOS44Mjk3NEgxNC41OTY2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMzIuNzA3NyAwLjMxMjI1NkwyMC45MzI2IDcuMzIwNDdMMjEuMzk5MyAxMi4xMzAxTDMyLjcwNzcgMC4zMTIyNTZaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIyIDI1LjA1MjJMMTkuOTkxMiAyOC45ODExTDI1LjE3MjIgMzAuNTE3NVYyNS4wNTIyWiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMjcuNzc2NiAxNi41MDI1SDI3Ljc3ODNIMjcuNzc2NlYxNi40OTkzTDI3Ljc3NSAxNi41MDA5TDIxLjQwMSAxMi4xMzMzTDIwLjQwNTMgMTguNTU2NUgyNS4xNzIyTDI3Ljc1ODYgMjAuOTk4M0wyNy43NzY2IDE2LjUwMjVaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik05LjgyNzkzIDMwLjUxNzVMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDUyMkg5LjgyNzkzVjMwLjUxNzVaIiBmaWxsPSIjRTM0ODA3Ii8+CjxwYXRoIGQ9Ik0xNC41OTQ3IDE4LjU1NDlMMTYuMDM0MSAyNy44NDA2TDE0LjAzOTMgMjIuNjc3N0w3LjIzOTc1IDIwLjk5ODRMOS44MjYxMyAxOC41NTQ5SDE0LjU5M0gxNC41OTQ3WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjUuMTcyMSAzMC41MTc1TDMyLjcwNzggMzIuNzUyMkwzNS4wMDAxIDI1LjA1MjJIMjUuMTcyMVYzMC41MTc1WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjAuNDA1MyAxOC41NTQ5TDE4Ljk2NTggMjcuODQwNkwyMC45NjA3IDIyLjY3NzdMMjcuNzYwMiAyMC45OTg0TDI1LjE3MjIgMTguNTU0OUgyMC40MDUzWiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMCAyNS4wNDg4TDIuMjkyMjUgMTYuNDk5M0g3LjIyMTgzTDcuMjM5OTEgMjAuOTk2N0wxNC4wMzk0IDIyLjY3NkwxNi4wMzQzIDI3LjgzODlMMTUuMDA4OSAyOC45NzZMOS44Mjc5MyAyNS4wNDcySDBWMjUuMDQ4OFoiIGZpbGw9IiNGRjhENUQiLz4KPHBhdGggZD0iTTM1LjAwMDEgMjUuMDQ4OEwzMi43MDc4IDE2LjQ5OTNIMjcuNzc4M0wyNy43NjAyIDIwLjk5NjdMMjAuOTYwNyAyMi42NzZMMTguOTY1OCAyNy44Mzg5TDE5Ljk5MTIgMjguOTc2TDI1LjE3MjIgMjUuMDQ3MkgzNS4wMDAxVjI1LjA0ODhaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yMC45MzI1IDcuMzE1NDNIMTcuNDk5OUgxNC4wNjczTDEzLjYwMDYgMTIuMTI1MUwxNi4wMzQyIDI3LjgzNEgxOC45NjU2TDIxLjQwMDggMTIuMTI1MUwyMC45MzI1IDcuMzE1NDNaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yLjI5MjI1IDAuMzEyMjU2TDAgOS4yNzA5NEwyLjI5MjI1IDE2LjQ5OTNINy4yMjE4M0wxMy41OTkxIDEyLjEzMDFMMi4yOTIyNSAwLjMxMjI1NloiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTEzLjE3IDIwLjQxOTlIMTAuOTM2OUw5LjcyMDk1IDIxLjYwNjJMMTQuMDQwOSAyMi42NzI3TDEzLjE3IDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTMyLjcwNzcgMC4zMTIyNTZMMzQuOTk5OSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0gyNy43NzgxTDIxLjQwMDkgMTIuMTMwMUwzMi43MDc3IDAuMzEyMjU2WiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMjEuODMzIDIwLjQxOTlIMjQuMDY5NEwyNS4yODUzIDIxLjYwNzlMMjAuOTYwNCAyMi42NzZMMjEuODMzIDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTE5LjQ4MTcgMzAuODM2MkwxOS45OTExIDI4Ljk3OTRMMTguOTY1OCAyNy44NDIzSDE2LjAzMjdMMTUuMDA3MyAyOC45Nzk0TDE1LjUxNjcgMzAuODM2MiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMTkuNDgxNiAzMC44MzU5VjMzLjkwMjFIMTUuNTE2NlYzMC44MzU5SDE5LjQ4MTZaIiBmaWxsPSIjQzBDNENEIi8+CjxwYXRoIGQ9Ik05LjgyOTU5IDMwLjUxNDJMMTUuNTIgMzMuOTAwOFYzMC44MzQ2TDE1LjAxMDYgMjguOTc3OEw5LjgyOTU5IDMwLjUxNDJaIiBmaWxsPSIjRTdFQkY2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIxIDMwLjUxNDJMMTkuNDgxNyAzMy45MDA4VjMwLjgzNDZMMTkuOTkxMSAyOC45Nzc4TDI1LjE3MjEgMzAuNTE0MloiIGZpbGw9IiNFN0VCRjYiLz4KPC9zdmc+Cg==",
    id: "io.metamask"
  },
  {

    name: "Trust Wallet",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTgiIGhlaWdodD0iNjUiIHZpZXdCb3g9IjAgMCA1OCA2NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOS4zODk0OUwyOC44OTA3IDBWNjUuMDA0MkM4LjI1NDUgNTYuMzM2OSAwIDM5LjcyNDggMCAzMC4zMzUzVjkuMzg5NDlaIiBmaWxsPSIjMDUwMEZGIi8+CjxwYXRoIGQ9Ik01Ny43ODIyIDkuMzg5NDlMMjguODkxNSAwVjY1LjAwNDJDNDkuNTI3NyA1Ni4zMzY5IDU3Ljc4MjIgMzkuNzI0OCA1Ny43ODIyIDMwLjMzNTNWOS4zODk0OVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yMjAxXzY5NDIpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMjIwMV82OTQyIiB4MT0iNTEuMzYxNSIgeTE9Ii00LjE1MjkzIiB4Mj0iMjkuNTM4NCIgeTI9IjY0LjUxNDciIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjAyMTEyIiBzdG9wLWNvbG9yPSIjMDAwMEZGIi8+CjxzdG9wIG9mZnNldD0iMC4wNzYyNDIzIiBzdG9wLWNvbG9yPSIjMDA5NEZGIi8+CjxzdG9wIG9mZnNldD0iMC4xNjMwODkiIHN0b3AtY29sb3I9IiM0OEZGOTEiLz4KPHN0b3Agb2Zmc2V0PSIwLjQyMDA0OSIgc3RvcC1jb2xvcj0iIzAwOTRGRiIvPgo8c3RvcCBvZmZzZXQ9IjAuNjgyODg2IiBzdG9wLWNvbG9yPSIjMDAzOEZGIi8+CjxzdG9wIG9mZnNldD0iMC45MDI0NjUiIHN0b3AtY29sb3I9IiMwNTAwRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K",
    id: "com.trustwallet.app"
  },
  {

    name: "Bitget Wallet",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjMDAxRjI5Ii8+CjxwYXRoIGQ9Ik0yMTkuOTQ4IDk1LjcwMjJDMjAxLjYyMyA5NS42OTI5IDE4My4zMyA5NS42ODM1IDE2NC45NDEgOTUuNzExNkMxNTMuODIyIDk1LjcxMTYgMTQ5LjY1MSAxMDkuNjcxIDE1Ny45MjEgMTE3LjkzOUwyODMuMDk4IDI0My4xMTdDMjg3LjAwNCAyNDYuNjkgMjg5LjQ0MSAyNTAuNTc0IDI4OS41MyAyNTUuNjkzQzI4OS40NDEgMjYwLjgxMiAyODcuMDA0IDI2NC42OTYgMjgzLjA5OCAyNjguMjY5TDE1Ny45MjEgMzkzLjQ0NkMxNDkuNjUxIDQwMS43MTUgMTUzLjgyMiA0MTUuNjc0IDE2NC45NDEgNDE1LjY3NEMxODMuMzMgNDE1LjcwMiAyMDEuNjIzIDQxNS42OTMgMjE5Ljk0OCA0MTUuNjgzQzIyOS4xMjIgNDE1LjY3OSAyMzguMzA1IDQxNS42NzQgMjQ3LjUxMSA0MTUuNjc0QzI1OS41NTUgNDE1LjY3NCAyNjYuNzIgNDA5LjI0IDI3My4xNTQgNDAyLjgwNUwzODYuMDQ3IDI4OS45MTJDMzk1LjA1NyAyODAuOTAyIDQwMy4xMTkgMjY4LjkzOSA0MDMuMDA5IDI1NS42OTNDNDAzLjExOSAyNDIuNDQ3IDM5NS4wNTcgMjMwLjQ4NCAzODYuMDQ3IDIyMS40NzRMMjczLjE1NCAxMDguNThDMjY2LjcyIDEwMi4xNDYgMjU5LjU1NSA5NS43MTE2IDI0Ny41MTEgOTUuNzExNkMyMzguMzA1IDk1LjcxMTYgMjI5LjEyMiA5NS43MDY5IDIxOS45NDggOTUuNzAyMloiIGZpbGw9IiMwMEYwRkYiLz4KPC9zdmc+Cg==",
    id: "com.bitget.web3"
  },
  {

    name: "OKX Wallet",
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=",
    id: "com.okex.wallet"
  },


]
const  add =computed(()=>{
  return t("navbar.add")
})
// 菜单列表
const menuList = computed(() => {
  return [
    {
      title: t("navbar.meun1.title"),
      index: "1",
      itemList: [
        {
          name: t("navbar.meun1.menu.name1"),
          path: "https://explorer.cpchain.com/",
          index: "1-1",
          acitved: true,
          type: "outLink",
        },
        {
          name: t("navbar.meun1.menu.name2"),
          path: "https://explorer-testnet.cpchain.com/",
          index: "1-2",
          acitved: true,
          type: "outLink",
        },
      ],
    },
    {
      title: t("navbar.meun2.title"),
      index: "2",
      itemList: [
        {
          name: t("navbar.meun2.menu.name1"),
          path: "",
          index: "2-1",
          acitved: false,
          type: "",
        },
        // {
        //   name: t("navbar.meun2.menu.name2"),
        //   path: "",
        //   index: "2-2",
        //   acitved: false,
        //   type: "",
        // },
        {
          name: t("navbar.meun2.menu.name3"),
          path: "",
          index: "2-3",
          acitved: false,
          type: "",
        },
        {
          name: t("navbar.meun2.menu.name4"),
          path: "/computerPower",
          index: "2-4",
          acitved: false,
          type: "",
        },
      ],
    },
    {
      title: t("navbar.meun3.title"),
      index: "3",
      itemList: [
        {
          name: t("navbar.meun3.menu.name1"),
          path: "https://cpchain.gitbook.io/cpchaingitbook/",
          index: "3-1",
          acitved: true,
          type: "outLink",
        },
        {
          name: t("navbar.meun3.menu.name2"),
          path: "https://cpchain.gitbook.io/cpchaingitbook/user-guides/connecting-wallet-to-cp-chain",
          index: "3-2",
          acitved: true,
          type: "outLink",
        }, // 主网教程
        {
          name: t("navbar.meun3.menu.name6"),
          path: "/developerSupport",
          index: "3-3",
          acitved: true,
          type: "link",
        },
      ],
    },
    {
      title: t("navbar.meun4.title"), // 工具
      index: "4",
      itemList: [
        {
          name: t("navbar.meun4.menu.name1"),
          path: "/faucet",
          index: "4-1",
          acitved: true,
          type: "link",
        },
        {
          name: t("navbar.meun4.menu.name2"),
          path: "",
          index: "4-2",
          acitved: false,
          type: "link",
        },
      ],
    },
  ];
});
// 挂载后让它自动打开

// 点击按钮／遮罩层的时候直接改 store.visible
function openPopup() {
  counterStore.visible = true;
}

// const avatar = generateBase64(address.value)
const dialogVisible = ref(false);
// 控制 Drawer 的状态
const drawer = ref(false);
function shortAddress(address) {
  if (typeof address !== 'string' || address.length < 10) {
    return ''
  }
  return address.slice(0, 6) + '...' + address.slice(-4)
}


const showConnet = computed(() => {
  return counterStore.isLogin
});
function islogin() {
  counterStore.isLogin = true
}
function closeLogin() {
  counterStore.isLogin = false
}
const showExit = ref(false);
watch(status, (newStatus) => {
  // console.log(newStatus)
  if (newStatus === "connected") {
    showConnet.value = false;
  }
});
const rpcUrl = 'https://cp-geth-rpc1-testnet.cpchain.com'

// 使用 ethers 提供的 JSON RPC Provider
const provider = new JsonRpcProvider(rpcUrl)
watch(locale, (newLocale, oldLocale) => {
  console.log("locale changed:", oldLocale, "=>", newLocale);

  // 这里可以加你的国际化响应操作
});

watch(address, async (newAddress) => {
  if (!newAddress) {
    balance.value = '0.0000'
    return
  }

  try {
    const raw = await provider.getBalance(newAddress)
    balance.value = parseFloat(formatEther(raw)).toFixed(4)
  } catch (err) {
    console.error('查询失败:', err)
    balance.value = '错误'
  }
}, { immediate: true }) // 立即执行一次
console.log(connectors);
// 存储当前滚动位置
const scrollY = ref(0);

async function wallconnects(id, chainId) {
  if (connectors.length > 1) {

    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 500)
    return
    // showConnet.value = false;
  }
  const connectMetaMask = async () => {
    const connector = connectors.find(c => c.id === id)
    console.log(connector)
    if (connector) {
      await connect({ connector, chainId })
    } else {
      ElMessage({
      message:add.value,
      type: 'error',
      duration: 1000,   // 显示时长，单位毫秒
      showClose: true,  // 显示关闭按钮
    })
    }

  }
  connectMetaMask()
  console.log(connectors)
  // await connect({ connector, chainId });
  closeLogin()
  // @click="connect({ connector, chainId })"
}
function disconnectbtn() {
  disconnect();
  showExit.value = false;
}
const newTop = ref();
// 计算 header 的样式
const headerStyle = ref({
  top: "0px", // Initial top position
  backgroundColor: "rgba(18, 18, 18, 0)", // 初始透明背景色
  transition: "background-color 0.3s ease", // 只保留背景色过渡效果
});

// 滚动事件处理函数
const handleScroll = () => {
  scrollY.value = window.scrollY; // 获取当前滚动位置
};

// 监听滚动位置变化，修改 header 样式
watchEffect(() => {
  // 背景色透明度：超过 150px 时背景色变深至不透明
  const opacity = scrollY.value > 70 ? 0.6 : scrollY.value / 70;
  const newTop = 0; // top 最大值为 30px
  // console.log(opacity)
  headerStyle.value = {
    backgroundColor: `rgba(18, 18, 18, ${opacity})`,

    transition: "top 0.3s ease,background-color 0.3s ease",
    top: `${newTop}px`, // 动态设置 top
  };
});

// 页面加载完成后监听滚动事件
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (e) {
    console.error('复制失败:', e)
    return false
  }
}
// 页面卸载前清除滚动事件监听
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
const handleSelect = (index, indexPath) => {
  console.log(index, indexPath);
  activeIndex.value = index;
  if (index == "6-3") {
    locale.value = "en-us"; // 切
    document.documentElement.setAttribute("data-lang", locale.value);
    setTimeout(() => {
      menuRef.value && menuRef.value.close && menuRef.value.close("6");
    }, 100);
  }
  if (index == "6-1") {
    locale.value = "zh-cn"; // 切
    document.documentElement.setAttribute("data-lang", locale.value);
    setTimeout(() => {
      menuRef.value && menuRef.value.close && menuRef.value.close("6");
    }, 100);
  } else if (index != "6-1" && index != "6-3") {
    const obj = menuList.value.find((item) => item.index === indexPath[0]);
    if (obj && obj.itemList) {
      const item = obj.itemList.find((item) => item.index === indexPath[1]);
      if (item && item.path && item.acitved) {
        // console.log(item.path);
        if (item.type == "outLink") {
          window.open(item.path, "_blank");
          return;
        } else {
          router.push(item.path);
          return;
        }
      }
    }
    openPopup();
  }
  // console.log("选中的菜单项：", index);
};
</script>

<style lang="scss" scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  10% {
    transform: translateX(-8px);
  }

  20% {
    transform: translateX(8px);
  }

  30% {
    transform: translateX(-8px);
  }

  40% {
    transform: translateX(8px);
  }

  50% {
    transform: translateX(-6px);
  }

  60% {
    transform: translateX(6px);
  }

  70% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }

  90% {
    transform: translateX(-2px);
  }

  100% {
    transform: translateX(0);
  }
}

.shake {
  animation: shake 0.8s cubic-bezier(.36, .07, .19, .97);
}

.el-menu-demo2 {
  width: 60px;

  :deep(.el-sub-menu .el-sub-menu__icon-arrow) {
    display: none;
  }
}

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
    height: 450px;
    max-width: 500px;
    border-radius: 16px;
    background: var(---, #151517);
    padding: 24px;
    position: relative;
    max-width: 360px;
    cursor: pointer;



    .warning {
      color: red;
    }

    h3 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
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

        display: flex;
        height: 64px;
        padding: 0 16px;
        justify-content: space-between;
        align-items: center;
        border-radius: 16px;
        background: var(---, #1E1E1E);
        margin-bottom: 10px;

        img {
          width: 32px;
          border-radius: 8px;
          /* 圆形头像 */
          object-fit: cover;
          /* 保证不变形 */
        }

        span {
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          // margin-left: 30px;
        }
      }
    }
  }

  .content2 {
    display: flex;
    max-width: 360px;
    width: 100%;
    // height: 250px;
    padding: 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    position: relative;
    border-radius: 16px;
    background: var(---, #151517);
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
      width: 100%;
    }

    .adds {
      text-align: center;

      // margin-top: 24px;
      img {
        width: 72px;
        height: 72px;
        border-radius: 100%;
      }

      .shortAddress {
        margin-top: 24px;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .exit {
        button {
          cursor: pointer;
          display: flex;
          height: 40px;
          width: 100%;
          padding: 10px;
          justify-content: center;
          align-items: center;
          gap: 4px;
          flex: 1 0 0;
          border-radius: 100px;
          background: var(---, #252629);
          border: none;
          outline: none;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
          color: #fff;
        }

        .blances {
          color: #8E8E92;

          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          margin-top: 10px;
          margin-bottom: 24px;
        }
      }
    }
  }
}

a {
  color: #fff;
  text-decoration: none;

  &:hover {
    color: var(--el-color-primary);
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
    backdrop-filter: blur(14px);
    padding: 0 24px;
    width: calc(100% - 48px);
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
        height: 40px;
        padding: 0px 16px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 100px;
        border: 1px solid #fff;
        color: #fff;
        width: 130px;

        font-size: 14px;
        font-weight: 500;
        background: transparent;
      }

      .conentc-btn {
        width: unset;
      }

      button:hover {
        cursor: pointer;

        border: 1px solid #00ce7a;

        color: #00ce7a;
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
          border: 1px solid #fff;
          color: #fff;

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
            border: 1px solid #fff;
            color: #fff;
            font-family: "PingFang SC";
            font-size: 12px;
            font-weight: 500;
            background: transparent;
          }

          button:hover {
            cursor: pointer;

            border: 1px solid #00ce7a;

            color: #00ce7a;
          }

          :deep(.el-icon:hover) {
            color: #00ce7a;
          }
        }
      }
    }
  }
}</style>
