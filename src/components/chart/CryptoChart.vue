<template>
  <main
    class="h-full flex w-full bg-[#151f31] justify-between items-center overflow-y-auto sm:flex-col"
  >
    <template v-if="!loading">
      <VChart class="w-full h-full pt-10" autoresize :option="chartData" />
    </template>
    <template v-else>
      <div class="w-full flex justify-center h-full items-center">
        <MLoader />
      </div>
    </template>
    <ChartPanel
      @change-type-line="changeTypeLine"
      @change-graphic="changeGraphic"
      @positive-new-dot="positiveNewDot"
      @negative-new-dot="negativeNewDot"
      :activeClass="activeClass"
    />
  </main>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import ChartPanel from "@/components/chart/chart-panel/ChartPanel.vue";
import MLoader from "@/components/ui/MLoader.vue";
import { useCryptoChart } from "@/composables/useCryptoChart";
import { CHART_TYPE } from "@/constants/chart";
import { ChartTypeValue } from "@/types/crypto-chart-types";

const {
  fetchStarterGraphic,
  webSocketRelaunch,
  positiveNewDot,
  negativeNewDot,
  selectedValue,
  typeChart,
  activeClass,
  loading,
  chartData,
} = useCryptoChart();

const changeGraphic = (value: string) => {
  selectedValue.value = value;
};
const changeTypeLine = (value: ChartTypeValue) => {
  activeClass.value = value === CHART_TYPE.LINE;
  typeChart.value = value;
  chartData.value.series[0].type = typeChart.value;
};

watch(selectedValue, () => {
  webSocketRelaunch();
});

watch(typeChart, () => {
  webSocketRelaunch();
});

onMounted(async () => {
  await fetchStarterGraphic();
});
</script>
