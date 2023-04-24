<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { currentImageStore } from '@/stores/currentImage';
const route = useRoute()
const imagemd5 = route.params.imagemd5
const currentImage = currentImageStore()

onMounted(() => {
    console.log(`ImageInfo : md5:[${imagemd5}]`);
    currentImage.fetchImageInfoByMd5(imagemd5)
    console.log(currentImage.currentImageInfo)
})
</script>

<template>
    <el-row :gutter="20">
        <el-col :span="16">
            <div class="grid-content ep-bg-purple" />
            <div>
                <el-image :src="currentImage.currentImageInfo.src" fit="scale-down" />
            </div>
        </el-col>
        <el-col :span="8">
            <el-form :model="currentImage.currentImageInfo" label-width="120px">
                <el-form-item label="名字">
                    <el-text>{{ currentImage.currentImageInfo.name }}</el-text>
                </el-form-item>
                <el-form-item label="文件类型">
                    <el-text>{{ currentImage.currentImageInfo.type }}</el-text>
                </el-form-item>
                <el-form-item label="宽度">
                    <el-text>{{ currentImage.currentImageInfo.width }}</el-text>
                </el-form-item>
                <el-form-item label="高度">
                    <el-text>{{ currentImage.currentImageInfo.height }}</el-text>
                </el-form-item>
                <el-form-item label="MD5">
                    <el-text>{{ currentImage.currentImageInfo.md5 }}</el-text>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style></style>