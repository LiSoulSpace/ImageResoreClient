<script setup lang="ts">
import { onMounted } from "vue";
import PublicImageShow from "@/components/PublicImageShow.vue";
onMounted(() => {
  console.log(`the HomeView is now mounted.`);
});
</script>

<template>
  <main>
    <!-- <UserImageShow /> -->
    <PublicImageShow/>
  </main>
</template>
