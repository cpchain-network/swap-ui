<template>
  <div class="footer">

    <el-row :gutter="10">
      <el-col :xs="24" :sm="8">
        <div class="name1">

          <img src="@/assets/images/cpChain.png" style="width:120px">

        </div>

        <div class="name2" v-html="cpChainLineBreak($t('footers.title'))"></div>


        <div style="height: 60px;display: flex;" class="icon">

          <el-icon :style="{ fontSize: iconSize + 'px' }">
            <a target="_blank" href="https://x.com/CPCHAINGLOBAL">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path
                  d="M14.176 0H16.9362L10.9061 6.77744L18 16H12.4456L8.09512 10.4066L3.11722 16H0.355444L6.80517 8.75077L0 0H5.69546L9.62788 5.11262L14.176 0ZM13.2073 14.3754H14.7368L4.8644 1.53929H3.22317L13.2073 14.3754Z"
                  fill="white" />
              </svg>


            </a>

          </el-icon>


          <!-- <el-icon :style="{ fontSize: iconSize + 'px', margin: iconSize / 2 + 'px' }"  @click="openPopup()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                <path
                  d="M12.2863 0C10.1825 0 8.47695 1.79086 8.47695 4C8.47695 4.33382 8.5159 4.65809 8.58927 4.96808C6.56635 4.96808 3.51939 4.55908 0.974682 2.00961C0.636299 1.67059 0.0123287 1.89726 0.0358001 2.37567C0.412925 10.0627 3.70501 12.3049 5.40034 12.4444C4.3056 13.5257 2.71534 14.3791 1.11513 14.7622C0.692808 14.8633 0.58848 15.3256 1.00144 15.4599C2.14647 15.8323 3.78541 15.9758 4.66759 16C10.9084 16 15.9809 10.7471 16.0938 4.22229C16.9131 3.68945 17.438 2.5325 17.7329 1.71291C17.8047 1.5133 17.4775 1.28073 17.2817 1.36226C16.6696 1.61708 15.8926 1.67749 15.2306 1.46181C14.532 0.569266 13.4725 0 12.2863 0Z"
                  fill="white" />
              </svg>



            </el-icon>

            <el-icon :style="{ fontSize: iconSize + 'px', margin: iconSize / 2 + 'px' }"  @click="openPopup()">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 18" fill="none">
                <path d="M12 0H9C6.23858 0 4 2.23858 4 5V7H0V11H4V18H8V11H12V7H8V5C8 4.44772 8.44771 4 9 4H12V0Z"
                  fill="white" />
              </svg>
            </el-icon>
            <el-icon :style="{ fontSize: iconSize + 'px', margin: iconSize / 2 + 'px' }"  @click="openPopup()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                <path
                  d="M6 18C9.31371 18 12 15.3137 12 12V5.19731C12.8825 5.70782 13.9071 6 15 6H16V3H15C13.3431 3 12 1.65685 12 0H9V12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9V6C2.68629 6 0 8.68629 0 12C0 15.3137 2.68629 18 6 18Z"
                  fill="white" />
              </svg>
            </el-icon> -->
        </div>
        <div class="contact">
          {{ $t('footers.contact') }} support@cpchain.com
        </div>
      </el-col>
      <el-col :xs="24" :sm="4">
      </el-col>
      <el-col :xs="12" :sm="3">
        <div class="title"> {{ $t('footers.content1.title') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content1.name1') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content1.name2') }}</div>
      </el-col>


      <el-col :xs="12" :sm="3">
        <div class="title"> {{ $t('footers.content2.title') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content2.name1') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content2.name2') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content2.name3') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content2.name4') }}</div>
      </el-col>

      <el-col :xs="12" :sm="3">
        <div class="title"> {{ $t('footers.content3.title') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content3.name1') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content3.name2') }}</div>



      </el-col>

      <el-col :xs="12" :sm="3">
        <div class="title"> {{ $t('footers.content4.title') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content4.name1') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content4.name2') }}</div>

        <div class="list" @click="openPopup()"> {{ $t('footers.content4.name3') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content4.name4') }}</div>
        <div class="list" @click="openPopup()"> {{ $t('footers.content4.name5') }}</div>
       
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref } from 'vue';
const iconSize = ref(15); // 设置图标的字体大小为 50px
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

// 拿到 store
const counterStore = useCounterStore()
const { visible } = storeToRefs(counterStore)
function openPopup() {
  counterStore.visible = true
}
function cpChainLineBreak(str) {
  if (!str) return '';
  // 正则查找"cp chain"，忽略大小写
  const reg = /cp chain/i;
  const match = str.match(reg);
  if (match && match.index === 0) {
    // 从头匹配，首行为cp chain
    const endIdx = match[0].length;
    return match[0] + '<br>' + str.slice(endIdx).trim();
  }
  // 不是开头出现也可以处理：
  if (match) {
    const idx = match.index;
    const endIdx = idx + match[0].length;
    // 分成两行
    return str.slice(0, endIdx) + '<br>' + str.slice(endIdx).trim();
  }
  // 没有匹配就原样返回
  return str;
}

</script>

<style scoped  lang="scss">
.footer {
  background: #151517;
  // height: 460px;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  /* 主轴改为竖直方向，从上到下 */
  // justify-content: flex-start; 
  padding: 0 76px;
  padding-bottom: 118px;
  padding-top: 80px;

  .content {
    // max-width: 1200px;

  }

  .icon {

    :deep(.el-icon) {
      background: rgb(44 44 46);
      width: 40px;
      height: 40px;

      border-radius: 100px;
    }

    
  }

  .name1 {

    font-weight: 400;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #fff;
    margin-bottom: 10px;

  }

  .name2 {

    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    color: #fff;
    margin: 20px 0;
    line-height: 22px;

  }

  .contact {

    font-weight: 500;
    font-size: 16px;

    letter-spacing: 0%;
    color: #fff;

  }

  .title {

    font-weight: 600;
    font-size: 16px;

    letter-spacing: 0%;
    color: #FFFFFF;
    margin-bottom: 20px;


  }

  .list {
    cursor: pointer;
    font-weight: 400;
    font-size: 14px;

    letter-spacing: 0%;
    color: #8E8E92;
    margin-bottom: 16px;
  }

  .list:hover {
    color: #fff;
  }

}

@media (max-width: 768px) {
  .footer {
    background: #151517;
    // height: 460px;
    padding: 0 15px;
    padding-bottom: 106px;
     padding-top: 30px;
    .name1 {

      font-weight: 400;
      font-size: 30px;
      line-height: 100%;
      letter-spacing: 0%;
      color: #fff;
      margin-bottom: 10px;

    }

    .name2 {

      font-weight: 600;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: 0%;
      color: #fff;
      margin: 20px 0;

    }

    .contact {

      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      color: #fff;
      margin-bottom: 15px;

    }

    .title {

      font-weight: 600;
      font-size: 16px;
      line-height: 100%;

      color: #FFFFFF;
      margin-bottom: 20px;


    }

    .list {

      font-weight: 400;
      font-size: 16px;
      line-height: 100%;
      letter-spacing: 0%;
      color: #8E8E92;
      margin-bottom: 15px;
    }

  }
}</style>