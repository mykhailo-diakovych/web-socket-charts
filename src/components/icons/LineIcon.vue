<template>
  <svg
    @click="$emit('change-type-line', CHART_TYPE.LINE)"
    :style="{ opacity: [activeClass ? 1 : 0.5] }"
    class="mr-2 hover:opacity-20 cursor-pointer w-20px h-20px"
    data-v-0902dc99=""
    width="2rem"
    height="2rem"
    viewBox="0 0 21 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.794118"
      y="0.794118"
      width="18.7821"
      height="17.4118"
      rx="3.97059"
      stroke="white"
      stroke-width="1.58824"
    />
    <path
      d="M5.55554 12L8.79628 8.5L11.5741 11.5L15.7407 6"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { CHART_TYPE } from "@/constants/chart";

defineProps({
  activeClass: Boolean,
});
</script>
