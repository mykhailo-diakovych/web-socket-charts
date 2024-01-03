<template>
  <div
    class="flex flex-col items-center justify-between sm:flex-row sm:items-center sm:justify-around sm:w-full"
  >
    <div class="flex flex-col justify-between items-center text-[#8f8281]">
      <p>Balance:</p>
      <p class="text-blue-100 text-[19px]">
        {{ formatNumber($store.state.balance, 2) }} usd
      </p>
    </div>
    <div class="flex flex-col justify-between items-center text-[#8f8281]">
      <p>Timer:</p>
      <p class="text-blue-100 text-[19px]">{{ $store.state.time }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formatNumber } from "@/utils/format-float";
</script>
