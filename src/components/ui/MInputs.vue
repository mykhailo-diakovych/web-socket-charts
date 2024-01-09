<template>
  <div class="w-9/12 flex flex-col">
    <label><slot></slot></label>
    <input
      :maxlength="5"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full text-white bg-[#151f31] pl-[3px] focus:outline-none focus:none cursor-pointer"
      type="number"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
