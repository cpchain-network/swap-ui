import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/homepage/index.vue'
import  about from "../views/home.vue"
import  dapp  from "../views/dapp/index.vue"
import   bridge  from  "../views/bridge/index.vue"
import   swap   from "../views/swap/index.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'swap',
      component: swap,
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    // 处理滚动行为：如果有保存的滚动位置，则恢复到该位置，否则滚动到顶部
  
      return { top: 0 }; // 跳转时滚动到顶部
    
  },
});
export default router
