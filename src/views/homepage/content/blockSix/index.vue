<template>
  <div class="blockSix">
    <div class=" wow animate__fadeInUp">
      <h3>{{ $t('blockSix.title') }}</h3>

      <div>
        <Vue3Marquee duration="400" pauseOnHover="true">


          <img style="margin:0 5px;" src="@/assets/parent/2.png" />
          <img style="margin:0 5px;" src="@/assets/parent/3.png" />
          <img style="margin:0 5px;" src="@/assets/parent/4.png" />
          <img style="margin:0 5px;" src="@/assets/parent/5.png" />
          <img style="margin:0 5px;" src="@/assets/parent/6.png" />
          <img style="margin:0 5px;" src="@/assets/parent/8.png" />
          <img style="margin:0 5px;" src="@/assets/parent/9.png" />
          <img style="margin:0 5px;" src="@/assets/parent/10.png" />



        </Vue3Marquee>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped  lang="scss">
.blockSix {
  // display: flex;
  // align-content: center;
  // align-items: center;
  overflow: hidden;
  height: 100vh;

  h3 {

    font-weight: 600;
    font-size: 48px;
    line-height: 100%;
    letter-spacing: 0px;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    margin-top: 40vh;
    margin-bottom: 16vh;
  }

  img {

    width: 220px;
    border: 1px solid #fff;
    border-radius: 100px;
    border: 1px solid transparent;
    margin: 0 20px;
    // filter: grayscale(100%) brightness(0.6)
  }

  img:hover {
    border: 1px solid #fff;
  }



}

@media (max-width: 768px) {
  .blockSix {
    height: 50vh;

    //       align-content: center;
    // align-items: center;
    h3 {

      font-weight: 600;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: 0px;
      text-align: center;
      vertical-align: middle;
      color: #fff;
      margin-top: 18vh;

    }

    img {
      width: 122px;
      // filter: grayscale(100%) brightness(0.6)
    }


  }

}
</style>