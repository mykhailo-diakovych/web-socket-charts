<template>
  <button class="cursor-pointer" @click="$emit('on-click-action')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
defineEmits(["on-click-action"]);
</script>
