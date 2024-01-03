<template>
  <aside
    class="flex flex-col items-center gap-3 justify-between mr-[20px] sm:mr-[0px]"
  >
    <div
      class="flex cursor-pointer absolute top-[5%] right-[25%] sm:right-[10%]"
    >
      <svg
        @click="$emit('changeTypeLine', 'line')"
        :style="{ opacity: [activeClass ? 1 : 0.5] }"
        class="mr-2 hover:opacity-20 cursor-pointer w-20px h-20px"
        data-v-0902dc99=""
        width="2rem"
        height="2rem"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="0.794118"
          y="0.794118"
          width="18.7821"
          height="17.4118"
          rx="3.97059"
          stroke="white"
          stroke-width="1.58824"
        ></rect>
        <path
          d="M5.55554 12L8.79628 8.5L11.5741 11.5L15.7407 6"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <svg
        @click="$emit('changeTypeLine', 'candlestick')"
        :style="{ opacity: [!activeClass ? 1 : 0.5] }"
        data-v-0902dc99=""
        width="2rem"
        height="2rem"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="hover:opacity-20 cursor-pointer w-20px h-20px"
      >
        <path
          d="M6.64819 13.033L6.64819 9.10742"
          stroke="white"
          stroke-width="0.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M14.9814 9.1075L14.9814 5.18188"
          stroke="white"
          stroke-width="0.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M9.4259 12.248L9.4259 5.96704"
          stroke="white"
          stroke-width="0.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M12.1355 13.8181L12.2037 5.18188"
          stroke="white"
          stroke-width="0.9"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M6.64819 11.4626L6.64819 10.6775"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M14.9814 7.53708L14.9814 6.75195"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M9.4259 10.6779L9.4259 8.32251"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M12.2037 11.4627L12.2037 7.53711"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <rect
          x="1.42376"
          y="0.794118"
          width="18.7821"
          height="17.4118"
          rx="3.97059"
          stroke="white"
          stroke-width="1.58824"
        ></rect>
      </svg>
    </div>
    <MSelect :options="allSelectOptions" v-model="selectedValue" />
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
    <section
      class="flex flex-col items-center justify-between sm:flex-row sm:gap-[10px] sm:p-[20px]"
    >
      <div class="flex flex-col gap-3">
        <div
          class="flex border-2 border-[#3e3f45] text-[#8f8281] rounded-md p-2"
        >
          <MInputs v-model="money" :bool="true">Sum</MInputs>
        </div>
        <div
          class="flex border-2 border-[#3e3f45] text-[#8f8281] rounded-md p-2"
        >
          <MInputs v-model="time" :bool="false">Time</MInputs>
        </div>
      </div>
      <div
        class="flex flex-col items-center gap-2 justify-between text-green-500 sm:hidden"
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
        <MButton :positive-new-dot="positiveNewDot" :bool="true"
          >Higher</MButton
        >
        <MButton :negative-new-dot="negativeNewDot" :bool="false"
          >Lower</MButton
        >
      </div>
    </section>
  </aside>
</template>

<script>
import MSelect from "@/componetns/ui/MSelect";
import MInputs from "@/componetns/ui/MInputs";
import MButton from "@/componetns/ui/MButton";
import { profitFormulaCurrency } from "@/utils/profit-formula";
import { formatNumber } from "@/utils/format-float";
import { ref, watch, computed } from "vue";
import { selectKeys, selectValues } from "@/core-data/select-options";
import { store } from "@/store";

export default {
  name: "AsidePanel",
  components: {
    MButton,
    MSelect,
    MInputs,
  },
  props: {
    activeClass: {
      type: Boolean,
    },
    positiveNewDot: {
      type: Function,
      required: true,
    },
    negativeNewDot: {
      type: Function,
      required: true,
    },
  },
  emits: ["changeGraphic", "changeTypeLine"],
  setup(props, { emit }) {
    const allSelectOptions = ref([
      { value: selectKeys.BTC_KEY, title: selectValues.BTC_KEY_VALUE },
      { value: selectKeys.ETH_KEY, title: selectValues.ETH_KEY_VALUE },
      { value: selectKeys.SOL_KEY, title: selectValues.SOL_KEY_VALUE },
      { value: selectKeys.BNB_KEY, title: selectValues.BNB_KEY_VALUE },
    ]);
    const selectedValue = ref("btc");
    const selectedType = ref("line");

    watch(selectedValue, () => {
      emit("changeGraphic", selectedValue.value);
    });

    const money = computed({
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

    return {
      allSelectOptions,
      selectedValue,
      money,
      time,
      selectedType,
      profitFormulaCurrency,
      formatNumber,
    };
  },
};
</script>
