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
      <button class="text-[18px]" @click="$store.commit('plusMoneyBet')">
        +
      </button>
      <button class="text-[18px]" @click="$store.commit('minusMoneyBet')">
        -
      </button>
    </template>
    <template v-else>
      <button class="text-[18px]" @click="$store.commit('plusTimeBet')">
        +
      </button>
      <button class="text-[18px]" @click="$store.commit('minusTimeBet')">
        -
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
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
