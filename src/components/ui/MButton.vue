<template>
  <template v-if="isPositive">
    <button
      class="cursor-pointer px-[30px] py-[20px] border-none rounded text-[18px] text-white mb-[10px] w-full bg-[#35A947]"
      @click="$emit('positive-new-dot')"
    >
      <slot></slot>
    </button>
  </template>
  <template v-else>
    <button
      class="cursor-pointer px-[30px] py-[20px] border-none rounded text-[18px] text-white mb-[10px] w-full bg-[#E34828]"
      @click="$emit('negative-new-dot')"
    >
      <slot></slot>
    </button>
  </template>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
defineProps({
  isPositive: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["positive-new-dot", "negative-new-dot"]);
</script>
