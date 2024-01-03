<template>
  <section
    class="flex flex-col items-center justify-between sm:flex-row sm:gap-[10px] sm:p-[20px]"
  >
    <div class="flex flex-col gap-3">
      <div class="flex border-2 border-[#3e3f45] text-[#8f8281] rounded-md p-2">
        <MInputs v-model="betValue" is-positive>Sum</MInputs>
      </div>
      <div class="flex border-2 border-[#3e3f45] text-[#8f8281] rounded-md p-2">
        <MInputs v-model="time" :is-positive="false">Time</MInputs>
      </div>
    </div>
    <div
      class="flex flex-col items-center mt-2 gap-2 justify-between text-green-500 sm:hidden"
    >
      <p class="text-white text-[14px]">Profit ?</p>
      <p class="text-5xl">+{{ $store.state.percentForProfit }}%</p>
      <p class="text-[18px] font-medium">
        +{{ formatNumber(profitFormulaCurrency($store.state.moneyBet), 0) }}
        dollars
      </p>
    </div>
    <div
      class="flex flex-col items-center w-full sm:h-[160px] sm:justify-between sm:gap-[14px]"
    >
      <MButton @positive-new-dot="$emit('positive-new-dot')" is-positive>
        Higher
      </MButton>
      <MButton
        @negative-new-dot="$emit('negative-new-dot')"
        :is-positive="false"
      >
        Lower
      </MButton>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { profitFormulaCurrency } from "@/utils/profit-formula";
import { formatNumber } from "@/utils/format-float";
import MInputs from "@/components/ui/MInputs.vue";
import MButton from "@/components/ui/MButton.vue";
import { computed, defineEmits } from "vue";
import { store } from "@/store";

defineEmits(["positive-new-dot", "negative-new-dot"]);

const betValue = computed({
  get() {
    return store.state.moneyBet;
  },
  set(value) {
    store.commit("onChangeMoneyBet", value);
  },
});

const time = computed({
  get() {
    return store.state.timeBet;
  },
  set(value) {
    store.commit("onChanheTimeBet", value);
  },
});
</script>
