<script setup lang="ts">
import { onMounted } from "vue";
import UserImageShow from "@/components/UserImageShow.vue";
onMounted(() => {
  console.log(`the HomeView is now mounted.`);
});
</script>

<template>
  <main>
    <h1>图像修复与管理系统</h1>
    <!-- <UserImageShow /> -->
    <!-- <ImageShow/> -->
  </main>
</template>
