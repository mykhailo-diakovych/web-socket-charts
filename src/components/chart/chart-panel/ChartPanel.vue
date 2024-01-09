<template>
  <aside
    class="flex flex-col items-center gap-3 justify-between mr-[20px] sm:mr-[0px]"
  >
    <div
      class="flex cursor-pointer absolute top-[5%] right-[25%] sm:right-[10%]"
    >
      <LineIcon
        :active-class="activeClass"
        @change-type-line="$emit('change-type-line', $event)"
      />
      <CandlestickIcon
        :active-class="activeClass"
        @change-type-line="$emit('change-type-line', $event)"
      />
    </div>
    <MSelect :options="CRYPTO_PAIR_OPTIONS" v-model="selectedCryptoPair" />
    <ChartPanelBalance />
    <ChartPanelControls
      @positive-new-dot="$emit('positive-new-dot')"
      @negative-new-dot="$emit('negative-new-dot')"
    />
  </aside>
</template>

<script setup lang="ts">
import MSelect from "@/components/ui/MSelect.vue";
import LineIcon from "@/components/icons/LineIcon.vue";
import CandlestickIcon from "@/components/icons/CandlestickIcon.vue";
import { ref, watch, defineEmits, defineProps } from "vue";
import { SELECT_KEYS, CRYPTO_PAIR_OPTIONS } from "@/constants/select-options";
import ChartPanelBalance from "@/components/chart/chart-panel/ChartPanelBalance.vue";
import ChartPanelControls from "@/components/chart/chart-panel/ChartPanelControls.vue";

const emit = defineEmits([
  "change-type-line",
  "change-graphic",
  "positive-new-dot",
  "negative-new-dot",
]);

defineProps({
  activeClass: {
    type: Boolean,
  },
});

const selectedCryptoPair = ref(SELECT_KEYS.BTC_KEY);

watch(selectedCryptoPair, () => {
  emit("change-graphic", selectedCryptoPair.value);
});
</script>
