<script setup lang="ts">
import { ref } from "vue"
export interface Props {
    source: string;
    thumbnail: string
    title?: string
    labels?: string[]
}

const props = defineProps<Props>()
const emits = defineEmits(["updatet:title", "update:labels", "update:source", "update:thumbnial"]);
</script>

<template>
    <a :herf="source">
        <el-image style="width: 100px; height: 100px" :src="thumbnail" fit="scale-down" />
    </a>
</template>

<style></style>
