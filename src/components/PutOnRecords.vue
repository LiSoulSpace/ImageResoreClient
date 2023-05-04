<script setup lang="ts">
</script>

<template>
    <el-row>
        <el-col :span="12">
          <el-space wrap>
            <div><el-checkbox v-model="checkedWallpaper" label="壁纸" /></div>
            <div><el-checkbox v-model="checkedPeople" label="人像" /></div>
          </el-space>
        </el-col>
        <el-col :span="4">
          <div style="align-items: center;">
            <el-space wrap size="small">
              <el-text style="width: 100px;">高度范围(输入)</el-text>
              <el-input style="width: 60px;" v-model="imgHeightDis[0]" placeholder="min" />
              <span>~</span>
              <el-input style="width: 60px;" v-model="imgHeightDis[1]" placeholder="max" />
            </el-space>
            <el-space wrap size="small">
              <el-text style="width: 100px;">宽度范围(输入)</el-text>
              <el-input style="width: 60px;" v-model="imgWidthDis[0]" placeholder="min" />
              <span>~</span>
              <el-input style="width: 60px;" v-model="imgWidthDis[1]" placeholder="max" />
            </el-space>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <div class="slider-demo-block">
              <el-text style="width: 100px;">图像高度范围</el-text>
              <el-slider v-model="imgHeightDis" range :max="8000" />
            </div>
            <div class="slider-demo-block">
              <el-text style="width: 100px;">图像宽度范围</el-text>
              <el-slider v-model="imgWidthDis" range :max="8000" />
            </div>
          </div>
        </el-col>
      </el-row>
</template>

