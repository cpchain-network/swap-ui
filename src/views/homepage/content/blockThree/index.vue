<template>
    <div class="blockThree">

  <div class="content">
        <div class="cp-title wow animate__fadeInUp" data-wow-delay="0.5s">
            <h2>{{ $t('blockThree.title') }}</h2>
            <p>
              {{ $t('blockThree.subTitle') }}
            </p>
        </div>
        <div class="content">
      
            <el-row>
                <el-col :xs="24" :sm="12" class="order-1-xs wow  animate__fadeInLeft" data-wow-delay="0.5s">
                    <div class="grid-content bgNo">
                       

                        <div class="p1">   {{ $t('blockThree.feature1Title') }}</div>
                        <div class="p2">  {{ $t('blockThree.feature1Description') }}</div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" class="order-2-xs wow animate__fadeInRight" data-wow-delay="0.5s">
                    <div class="grid-content">
                      <div class="grid1">
                        <img src="@/assets/images/mask/8.png" alt="">
                      </div>
                    </div>
                </el-col>

            </el-row>

            <el-row >
                <el-col :xs="24" :sm="12" class="wow  animate__fadeInLeft" data-wow-delay="0.5s">
                    <div class="grid-content ">
                        
                      <div class="grid1">
                        <img src="@/assets/images/mask/6.png" alt="">
                      </div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12"  class="order-2-xs wow animate__fadeInRight" data-wow-delay="0.5s">
                    <div class="grid-content bgNo">
                       

                        <div class="p1">   {{ $t('blockThree.feature2Title') }}</div>
                        <div class="p2">  {{ $t('blockThree.feature2Description') }}</div>
                    </div>
                </el-col>

            </el-row>


            <el-row >
                <el-col :xs="24" :sm="12" class="order-1-xs wow  animate__fadeInLeft" data-wow-delay="0.5s">
                    <div class="grid-content bgNo">
                    

                        <div class="p1">   {{ $t('blockThree.feature3Title') }}</div>
                        <div class="p2">  {{ $t('blockThree.feature3Description') }}</div>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="12" class="order-2-xs wow animate__fadeInRight" data-wow-delay="0.5s">
                    <div class="grid-content">

                      <div class="grid1">
                        <img src="@/assets/images/mask/7.png" alt="">
                      </div>
                    </div>
                </el-col>

            </el-row>
        </div>
      </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped  lang="scss">
.grid1 {
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  // position: absolute;
  // top: 0;
  // left:0;
  img {
    width: 100%;
  }
  // background: url("@/assets/images/mask/5.png");
  // background-repeat: no-repeat;
  // background-size: 100%  100%;
}


.grid-content {
  position: relative;
    border-radius: 24px;
    border: 0.75px solid rgba(255, 255, 255, 0.08);
    background: #181818;
    // height: 320px;
    margin-bottom: 10px;
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

      font-size: 30px;
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
        color: #FFF;
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

  .bgNo {
    background: transparent !important;
    border: none !important;
    height: calc(100% - 48px);
    padding: 24px 72px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
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


.blockThree {
    padding: 0 118px;
    display: flex;
  flex-direction: column;    /* 主轴改为竖直方向，从上到下 */
  justify-content: flex-start; 

  align-items: center;       /* 水平方向居中 */
margin-bottom: 160px;
  .content  {
  max-width: 1200px;

}
    .cp-title {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        padding-top: 160px;

        h2 {
            color: #FFF;
            width: 100%;
            text-align: center;
            text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
       
            font-size: 48px;
            // height: 0.67rem;
            font-style: normal;
            font-weight: 600;
            line-height: 0.67rem;

        }

        p {
            margin-top: 15px;
            color: #8E8E92;
            text-align: center;
            
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;

            margin-bottom: 99px;
        }
    }
}

@media (max-width: 768px) {
  .bgNo {
    background: transparent !important;
    border: none !important;
    height: calc(100% - 48px);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }

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
      // height: 280px;
      margin-bottom: 10px;
      //  padding: 24px;

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
          color: #FFF;
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
    .blockThree {
        padding: 0 15px;
        // height: 11.83rem;

        // background-image: url("../assets/images/star.png");
        // background-size: 100% 100%;
        // background-repeat: no-repeat;

        .cp-title {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            padding-top: 160px;

            h2 {
                color: #FFF;
                width: 100%;
                text-align: center;
                text-shadow: 0 0.03rem 0.03rem rgba(0, 0, 0, 0.25);
               
                font-size: 24px;
                line-height: 30px;
                font-style: normal;
                font-weight: 600;
                // line-height: 0.67rem;

            }

            p {
                margin-top: 15px;
                color: #8E8E92;
                text-align: center;
             
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                // width: 80%;
                margin-bottom: 99px;
            }
        }
    }

}
</style>