<template>
    <div class="blockTwo">


        <div class="cp-title  wow animate__fadeInUp" data-wow-delay="0.5s">
            <h2>  {{ $t('blockTwo.title') }}</h2>
            <p>
              {{ $t('blockTwo.intro') }}
            </p>
        </div>

        <div class="cp-title2  wow animate__fadeInUp" data-wow-delay="0.5s">
            <h2 class=" wow animate__fadeInUp" data-wow-delay="0.5s">
              {{ $t('blockTwo.subTitle') }}
            </h2>
            <div style="width: 100%;">
                <el-row :gutter="20" class=" wow animate__bounceInLeft" data-wow-delay="0.5s">
                    <el-col :xs="24" :sm="14">
                        <div class="grid-content">
                          <!-- <div class="grid2">
                            <img src="@/assets/images/containerbig/1.png" alt="">
                          </div> -->
                          <div class="p1"> {{ $t('blockTwo.feature1Title') }}</div>
                            <div class="p2">{{ $t('blockTwo.feature1Description') }}</div> --> 
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="10">

                        <div class="grid-content">

                            <div class="num">
                                <div class="name1">1,000</div>
                                <div class="name2">+TPS</div>
                            </div>
                            <div class="p1 baseline">{{ $t('blockTwo.feature2Title') }}</div>
                            <div class="p2 baseline">{{ $t('blockTwo.feature2Description') }}</div>
                        </div>
                    </el-col>

                </el-row>
                <el-row :gutter="20" class=" wow animate__bounceInLeft" data-wow-delay="0.5s">
                    <el-col :xs="24" :sm="10">
                        <div class="grid-content">
                            <div class="num">
                                <div class="name3">0</div>
                            </div>
                            <div class="p1 baseline">{{ $t('blockTwo.feature3Title') }}</div>
                            <div class="p2 baseline">{{ $t('blockTwo.feature3Description') }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="7">
                        <div class="grid-content">
                            <div class="num2">
                                <div class="name4">0.5</div>
                            </div>
                            <div class="p1 baseline">{{ $t('blockTwo.feature4Title') }}</div>

                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="7">
                        <div class="grid-content ep-bg-purple-light">
                            <div class="num2">
                                <!-- <div class="name4">0.5</div> -->
                            </div>
                            <div class="p1 baseline">{{ $t('blockTwo.feature5Title') }}</div>
                        </div>
                    </el-col>

                </el-row>


                <el-row :gutter="20" class=" wow animate__bounceInLeft" data-wow-delay="0.5s">
                    <el-col :xs="24" :sm="17">
                        <div class="grid-content ep-bg-purple">
                            <div class="num">

                            </div>

                            <div class="p1">{{ $t('blockTwo.feature6Title') }}</div>
                            <div class="p2">{{ $t('blockTwo.feature6Description') }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="24" :sm="7">
                        <div class="grid-content ep-bg-purple-light">
                            <div class="num3">
                                <div class="p1">{{ $t('blockTwo.feature7Title') }}</div>
                            </div>
                        </div>
                    </el-col>


                </el-row>


            </div>


        </div>




    </div>
</template>

<script setup>

</script>

<style scoped  lang="scss">
 .grid-content {
    border-radius: 24px;
    border: 0.75px solid rgba(255, 255, 255, 0.08);
    background: #181818;
    height: 340px;
    margin-bottom: 20px;
   // padding: 24px;
    position: relative;

    .baseline {
      text-align: center;
    }

    .img {
      width: 100%;
      height: 100%;
      // background: red;


      background: url("../assets/images/circle.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;




    }

    .p1 {
      color: #FFF;

      font-size: 24px;
      font-style: normal;
      font-weight: 587;
      line-height: 40px;
      height: 40px;
      /* 166.667% */
    }

    .p2 {
      color: #8E8E92;

      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      /* 150% */
      height: 24px;
    }

    .num {
      display: flex;
      //  height: 80%;
      width: 100%;
      //  background: red;
      height: 198px;
      align-items: center;
      justify-content: center;

      // text-align: ;
      .name1 {
        color: #FFF;
        // text-align: center;

        font-size: 80px;
        font-style: normal;
        font-weight: 587;
        line-height: 40px;
        /* 50% */
      }

      .name2 {
        color: #FFF;

        font-size: 40px;
        font-style: normal;
        font-weight: 587;
        line-height: 40px;
      }

      .name3 {
        color: #00CE7A;
;
        text-align: center;

        font-size: 140px;
        font-style: normal;
        font-weight: 587;
        line-height: 40px;
        /* 28.571% */
      }
    }

    .num2 {
      display: flex;
      //  height: 80%;
      width: 100%;
      //  background: red;
      height: 232px;
      align-items: center;
      justify-content: center;

      .name4 {
        color: #FFF;
        text-align: center;

        font-size: 80px;
        font-style: normal;
        font-weight: 587;
        line-height: 40px;
        /* 50% */
      }
    }

    .num3 {
      display: flex;
      //  height: 80%;
      width: 100%;
      //  background: red;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
  }
  .grid2 {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left:0;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;   /* or “cover” 根据需求选一个 */
  object-position: center center;  /* 居中对齐 */
  }
  // background: url("@/assets/images/mask/5.png");
  // background-repeat: no-repeat;
  // background-size: 100%  100%;
}
  .bgNo {
    background: transparent !important;
    border: none !important;
    height: auto !important;
  }

  .order-1-xs {
    order: 1;
  }

  .order-2-xs {
    order: 2;
  }

  .orders-1-xs {
    order: 1;
  }

  .orders-2-xs {
    order: 2;
  }

  .orders-3-xs {
    order: 3;
  }



.blockTwo {
    overflow: hidden;
    padding: 0 118px;
 


    .cp-title {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
         height: 60vh;
        h2 {
            color: #FFF;
            width: 100%;
            text-align: center;
            text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
         
            font-size: 48px;
            height: 0.67rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.67rem;
            margin-top: 118px;
            // margin-bottom: 20px;


        }

        p {
            margin-top: 10px;
            color: #8E8E92;
            text-align: center;
         
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            // width: 8.65rem;
            margin-top: 15px;

        }
    }

    .cp-title2 {
        display: flex;
        // justify-content: center;
        flex-wrap: wrap;
        margin-top: 100px;

        h2 {
            color: #FFF;
            width: 100%;
            text-align: center;
            text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
           
            font-size: 48px;
            // height: 67px;
            font-style: normal;
            font-weight: 600;
            line-height: 67px;
            margin-bottom: 40px;
        }

        .content {
            width: 100%;

        }



    }
}

@media (max-width: 768px) {
    .order-1-xs {
      order: 2 !important;
    }

    .order-2-xs {
      order: 1 !important;
    }

    /* 颠倒顺序 */

    .orders-1-xs {
      order: 3;
    }

    .orders-2-xs {
      order: 1;
    }

    .orders-3-xs {
      order: 2;
    }


    .baseline {
      text-align: left !important;
    }

    .grid-content {
      border-radius: 24px;
      border: 0.75px solid rgba(255, 255, 255, 0.08);
      background: #181818;
      height: 300px;
      margin-bottom: 20px;
     // padding: 24px;

      .baseline {
        text-align: center;
      }

      .img {
        width: 100%;
        height: 100%;
        // background: red;


        background: url("../assets/images/circle.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;




      }

      .p1 {
        color: #FFF;

        font-size: 16px;
        font-style: normal;
        font-weight: 587;
        line-height: 40px;
        height: 40px;
        /* 166.667% */
      }

      .p2 {
        color: #8E8E92;

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        /* 150% */
        height: 24px;
      }

      .num {
        display: flex;
        //  height: 80%;
        width: 100%;
        //  background: red;
        // height: 198px;
        align-items: center;
        justify-content: center;

        // text-align: ;
        .name1 {
          color: #FFF;
          // text-align: center;

          font-size: 56px;
          font-style: normal;
          font-weight: 587;
          line-height: 40px;
          /* 50% */
        }

        .name2 {
          color: #FFF;

          font-size: 20px;
          font-style: normal;
          font-weight: 587;
          line-height: 40px;
        }

        .name3 {
          color: #00CE7A;
          text-align: center;

          font-size: 120px;
          font-style: normal;
          font-weight: 587;
          line-height: 40px;
          /* 28.571% */
        }
      }

      .num2 {
        display: flex;
        //  height: 80%;
        width: 100%;
        //  background: red;
        height: 232px;
        align-items: center;
        justify-content: center;

        .name4 {
          color: #FFF;
          text-align: center;

          font-size: 56px;
          font-style: normal;
          font-weight: 587;
          line-height: 40px;
          /* 50% */
        }
      }

      .num3 {
        display: flex;
        //  height: 80%;
        width: 100%;
        //  background: red;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
    .blockTwo {
        padding: 0 15px;
        // height: 11.83rem;

        // background-image: url("../assets/images/star.png");
        // background-size: 100% 100%;
        // background-repeat: no-repeat;

        .cp-title {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;

            h2 {
                color: #FFF;
                width: 100%;
                text-align: center;
                text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
              
                font-size: 24px;
                height: auto !important;
                font-style: normal;
                font-weight: 600;

                margin-top: 118px;


            }

            p {
                margin-top: 10px;
                color: #8E8E92;
                text-align: center;

                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                // width: 8.65rem;
                margin-top: 15px;

            }
        }

        .cp-title2 {
            display: flex;
            // justify-content: center;
            flex-wrap: wrap;
            margin-top: 50px;

            h2 {
                color: #FFF;
                width: 100%;
                text-align: center;
                text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
               
                font-size: 24px;
                height: auto;
                font-style: normal;
                font-weight: 600;
                line-height: 30px;

                margin-bottom: 40px;
            }

            .content {
                width: 100%;

            }



        }
    }

}
</style>