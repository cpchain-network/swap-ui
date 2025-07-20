import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en_US'

const i18n = createI18n({
  legacy: false,
      locale: 'en-us', // 默认显示语言
    // locale: 'zh-cn',
  messages: {
    'zh-cn': zhCN,
    'en-us': enUS
  }
})
document.documentElement.setAttribute('data-lang', "en-us"); 
export default i18n;
