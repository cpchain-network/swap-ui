<template>
    <div class="footer">

        <el-row :gutter="10">
            <el-col :xs="24" :sm="8">
                <div class="name1">
                    <img src="@/assets/images/1750584004667.jpg" style="width:40px">
                    <span>CP Chain</span>
                </div>

                <div class="name2">{{ $t('footers.title') }}</div>

           

                <div class="contact">
                    {{ $t('footers.contact') }}
                </div>
            </el-col>

            <el-col :xs="12" :sm="4">
                <div class="title"> {{ $t('footers.content1.title') }}</div>

                <div class="list"> {{ $t('footers.content1.name1') }}</div>
            </el-col>


            <el-col :xs="12" :sm="4">
                <div class="title"> {{ $t('footers.content2.title') }}</div>

                <div class="list"> {{ $t('footers.content2.name1') }}</div>
                <div class="list"> {{ $t('footers.content2.name2') }}</div>

                <div class="list"> {{ $t('footers.content2.name3') }}</div>
            </el-col>

            <el-col :xs="12" :sm="4">
                <div class="title"> {{ $t('footers.content3.title') }}</div>

                <div class="list"> {{ $t('footers.content3.name1') }}</div>
                <div class="list"> {{ $t('footers.content3.name2') }}</div>



            </el-col>

            <el-col :xs="12" :sm="4">
                <div class="title"> {{ $t('footers.content4.title') }}</div>

                <div class="list"> {{ $t('footers.content4.name1') }}</div>
                <div class="list"> {{ $t('footer.content4.name2') }}</div>

                <div class="list"> {{ $t('footers.content4.name3') }}</div>
                <div class="list"> {{ $t('footers.content4.name4') }}</div>
                <div class="list"> {{ $t('footers.content4.name5') }}</div>
            </el-col>
        </el-row>

    </div>
</template>

<script setup>
import { ref } from 'vue';
const iconSize = ref(30); // 设置图标的字体大小为 50px
</script>

<style scoped  lang="scss">
.footer {
    background: #151517;
    // height: 460px;
    padding: 0 118px;
    overflow: hidden;

    .name1 {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 20px;
        line-height: 100%;
        letter-spacing: 0%;
        color: #fff;
        margin-bottom: 10px;

    }

    .name2 {
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 24px;
        line-height: 100%;
        letter-spacing: 0%;
        color: #fff;
        margin: 20px 0;

    }

    .contact {
        font-family: PingFang SC;
        font-weight: 500;
        font-size: 16px;

        letter-spacing: 0%;
        color: #fff;

    }

    .title {
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 16px;

        letter-spacing: 0%;
        color: #FFFFFF;
        margin-bottom: 20px;


    }

    .list {
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;

        letter-spacing: 0%;
        color: #8E8E92;
        margin-bottom: 20px;
    }

}

@media (max-width: 768px) {
    .footer {
        background: #151517;
        // height: 460px;
        padding: 0 15px;

        .name1 {
            font-family: PingFang SC;
            font-weight: 400;
            font-size: 30px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #fff;
            margin-bottom: 10px;

        }

        .name2 {
            font-family: PingFang SC;
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
            font-family: PingFang SC;
            font-weight: 400;
            font-size: 16px;
            line-height: 100%;
            letter-spacing: 0%;
            color: #8E8E92;
            margin-bottom: 20px;
        }

    }
}
</style>