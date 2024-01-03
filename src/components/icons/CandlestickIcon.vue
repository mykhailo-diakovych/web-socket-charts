<template>
  <svg
    @click="$emit('change-type-line', CHART_TYPE.CANDLESTICK)"
    :style="{ opacity: [!activeClass ? 1 : 0.5] }"
    data-v-0902dc99=""
    width="2rem"
    height="2rem"
    viewBox="0 0 21 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="hover:opacity-20 cursor-pointer w-20px h-20px"
  >
    <path
      d="M6.64819 13.033L6.64819 9.10742"
      stroke="white"
      stroke-width="0.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M14.9814 9.1075L14.9814 5.18188"
      stroke="white"
      stroke-width="0.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M9.4259 12.248L9.4259 5.96704"
      stroke="white"
      stroke-width="0.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M12.1355 13.8181L12.2037 5.18188"
      stroke="white"
      stroke-width="0.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M6.64819 11.4626L6.64819 10.6775"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M14.9814 7.53708L14.9814 6.75195"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M9.4259 10.6779L9.4259 8.32251"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <path
      d="M12.2037 11.4627L12.2037 7.53711"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
    <rect
      x="1.42376"
      y="0.794118"
      width="18.7821"
      height="17.4118"
      rx="3.97059"
      stroke="white"
      stroke-width="1.58824"
    ></rect>
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { CHART_TYPE } from "@/constants/chart";

defineProps({
  activeClass: Boolean,
});
</script>
