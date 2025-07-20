<template>
    <div class="blockSeven">
        <div class=" wow animate__fadeInUp">
            <h4>{{ $t('blockSeven.title') }}</h4>


            <Vue3Marquee duration="500" pauseOnHover="true" style="overflow: hidden;">
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/1.png">
                </div>

                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/8.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/11.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/4.png">
                </div>

                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/6.png">
                </div>

                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/10.png">
                </div>
               
            </Vue3Marquee>

            <Vue3Marquee duration="500" pauseOnHover="true" :direction="'reverse'" style="overflow: hidden;">
                 
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/2.png">
                </div>
               
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/9.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/3.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/12.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/13.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/5.png">
                </div>
                <div class="item">
                    <!-- 1 -->
                    <img src="@/assets/images/footer/7.png">
                </div>
            </Vue3Marquee>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style  scoped  lang="scss">
.blockSeven {
    height: 859px;
    overflow: hidden;
    padding-top: 100px;

    // background-image: url("../assets/images/star.png");
    // background-size: 100% 100%;
    // background-repeat: no-repeat;
    .item {
        height: auto;
        width: auto;
        overflow: hidden;
        height: 268px;
        //  background: red;
         margin-bottom: 16px ;
         margin-right: 16px;

        // height: 100px;
    }

    h3 {

        font-weight: 600;
        font-size: 48px;
        line-height: 100%;
        letter-spacing: 0px;
        text-align: center;
        vertical-align: middle;
        color: #fff;
    }

    h4 {

        font-weight: 600;
        font-size: 48px;
        line-height: 100%;
        letter-spacing: 0px;
        vertical-align: middle;
        color: #fff;

        padding: 0 0 40px 120px;

    }

    img {
        filter: grayscale(100%) brightness(0.6);
        height: 268px;
        // width: 100%;
        transition: transform 0.3s ease;
        /* 或者使用其他数值，比如0.3，0.7等 */
        /* 如果需要半透明效果，可以添加 */
        /* opacity: 0.5; */
    }

    img:hover {
        filter: grayscale(100%) brightness(0.6);
        height: 268px;
        transform: scale(1.02)
            /* 或者使用其他数值，比如0.3，0.7等 */
            /* 如果需要半透明效果，可以添加 */
            /* opacity: 0.5; */
    }
}

@media (max-width: 768px) {
    .blockSeven {
        height: 402px;
        // background-image: url("../assets/images/star.png");
        // background-size: 100% 100%;
        background-repeat: no-repeat;


        h3 {

            font-weight: 600;
            font-size: 24px;
            line-height: 100%;
            letter-spacing: 0px;
            text-align: center;
            vertical-align: middle;
            color: #fff;
        }

        h4 {

            font-weight: 600;
            font-size: 24px;
            line-height: 100%;
            letter-spacing: 0px;
            vertical-align: middle;
            color: #fff;

            padding: 0 0 30px 15px;

        }
        .item {
        height: auto;
        width: auto;
        overflow: hidden;
        height: 120px;
        margin-bottom: 10px ;
         margin-right: 10px;
    }

        img {
            filter: grayscale(100%) brightness(0.6);
            height: 120px;
            // width: 100%;
            transition: transform 0.3s ease;
            /* 或者使用其他数值，比如0.3，0.7等 */
            /* 如果需要半透明效果，可以添加 */
            /* opacity: 0.5; */
        }

        img:hover {
            filter: grayscale(100%) brightness(0.6);
            height: 120px;
            transform: scale(1.02)
                /* 或者使用其他数值，比如0.3，0.7等 */
                /* 如果需要半透明效果，可以添加 */
                /* opacity: 0.5; */
        }
    }

}</style>