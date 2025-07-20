import { Buffer } from 'buffer'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { WagmiPlugin } from '@wagmi/vue'
import { createApp } from 'vue'
import router from './router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import './styles/global.scss'
import i18n from "./languages"
// `@coinbase-wallet/sdk` uses `Buffer`
globalThis.Buffer = Buffer
import Vue3Marquee from 'vue3-marquee'
import App from './App.vue'
// import './style.css'
import { config } from './wagmi'

// import "./utils/font.js"

const minShowTime = 800; // ms
const startTime = Date.now();

let mountReady = false; // 是否已挂载
let canFinish = false;  // 是否可以完成
let fakeLoading = setInterval(() => {
  if (percent < 98) {
    percent += 1;
    percentDom && (percentDom.textContent = percent + '%');
  } else if (mountReady && canFinish) {
    finishLoading();
  }
}, 10);




const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(WagmiPlugin, { config }).use(VueQueryPlugin, {})
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Vue3Marquee)

app.mount('#app')


new WOW({
    boxClass: 'wow',              // 动画元素的类
    animateClass: 'animate__animated',  // 动画效果类名
    offset: 100,                  // 设置触发动画的滚动偏移量
    mobile: true,                 // 是否启用移动端动画
    live: true,                   // 动态加载的内容是否启用动画
}).init();

clearInterval(fakeLoading);
percentDom && (percentDom.textContent = '100%');
if (mask) {
  mask.style.opacity = 0;
  setTimeout(() => mask.remove(), 320);
}