<template>
  <main
    class="h-full flex w-full bg-[#151f31] justify-between items-center overflow-y-auto sm:flex-col"
  >
    <template v-if="!loading">
      <v-chart class="w-full h-full pt-10" autoresize :option="chartData" />
    </template>
    <template v-else>
      <div class="w-full flex justify-center h-full items-center">
        <MLoader />
      </div>
    </template>
    <template
      class="flex flex-col items-center gap-3 justify-between mr-[20px] sm:mr-[0px]"
    >
      <aside-panel
        @changeTypeLine="changeTypeLine"
        @changeGraphic="changeGraphic"
        :positive-new-dot="positiveNewDot"
        :negative-new-dot="negativeNewDot"
        :activeClass="activeClass"
      />
    </template>
  </main>
</template>
<script setup lang="ts">
import { onMounted, watch } from "vue";
import AsidePanel from "@/componetns/AsidePanel";
import MLoader from "@/componetns/ui/MLoader";
import { useCryptoChart } from "@/composables/useCryptoChart";

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
const changeTypeLine = (value: string) => {
  activeClass.value = value === "line";
  typeChart.value = value;
  chartData.value.series[0].type = typeChart.value;
};

onMounted(async () => {
  await fetchStarterGraphic();
});

watch(selectedValue, () => {
  webSocketRelaunch();
});

watch(typeChart, () => {
  webSocketRelaunch();
});
</script>
