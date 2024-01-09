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
  <div class="w-3/12 flex flex-col">
    <template v-if="isPositive">
      <button class="text-[18px]" @click="plusMoneyBet">+</button>
      <button class="text-[18px]" @click="minusMoneyBet">-</button>
    </template>
    <template v-else>
      <button class="text-[18px]" @click="plusTimeBet">+</button>
      <button class="text-[18px]" @click="minusTimeBet">-</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useChartStore } from "@/store";

defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  isPositive: {
    type: Boolean,
    required: true,
  },
});

const { plusMoneyBet, minusMoneyBet, plusTimeBet, minusTimeBet } =
  useChartStore();
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
