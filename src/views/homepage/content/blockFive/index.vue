<template>
    <div class="blockFive">
        <video src="@/assets/2.mp4" autoplay muted loop playsinline style=" transform: scale(1.5); " ></video>
    </div>
</template>

<script setup>

</script>

<style scoped  lang="scss">
.blockFive {
    overflow: hidden;
      background: #000;
    height: 400px;
    display: flex;
    justify-content: center;
   

    // img {
    //     height: ;
    
     
}

@media (max-width: 768px) {
    .blockFive {
         background: #000;
        height: 200px;
        display: flex;
        justify-content: center;

    //     img {
    //         height: 100%;
    //     }
     }
}
</style>