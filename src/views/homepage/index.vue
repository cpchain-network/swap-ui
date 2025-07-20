<template>
    <div class="home">
        <bg />
        <blockOne/>
        <blockTwo/>
        <blockThree/>
        
      <history/>
        <!-- <blockFour/>
        <blockFive/> -->
        <blockSix/>
        <blockSeven/>
        <!-- <bottomBar/> -->
        <popup></popup>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import  popup  from "@/components/popup.vue"
import bg from "@/components/bg.vue"
import  home    from "../home.vue"
import swiperbar  from "@/components/swiper.vue"
import  blockOne from "./content/blockOne/index.vue"

import blockTwo from "./content/blockTwo/index.vue"
import blockThree  from  "./content/blockThree/index.vue"
import blockFour  from  "./content/blockFour/index.vue"
import  blockFive from "./content/blockFive/index.vue"
import blockSix  from "./content/blockSix/index.vue"
import blockSeven from "./content/blockSeven/index.vue"
import  history  from "./content/history.vue"
// import   bottomBar  from "./content/footer/index.vue"
</script>
<style scoped  lang="scss">
.home {
    overflow-x: hidden;
    position: relative;
    min-height: 1000px;
    
}
</style>