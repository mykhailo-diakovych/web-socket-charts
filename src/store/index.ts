import { defineStore } from "pinia";
import { ref } from "vue";
import { profitFormulaCurrency } from "@/utils/profit-formula";
import {
  DEFAULT_BET,
  DEFAULT_TIME_BET,
  DEFAULT_USER_BALANCE,
} from "@/constants/chart";

export const useChartStore = defineStore("chart-store", () => {
  const moneyBet = ref<any>(DEFAULT_BET);
  const balance = ref(DEFAULT_USER_BALANCE);
  const timeBet = ref(DEFAULT_TIME_BET);
  const time = ref(0);
  const winnerBetDots = ref<any>([]);
  const winnerBet = ref<any>([]);
  const disabledTimeButton = ref(false);

  function calculateCurrentBalance(newValue: number) {
    balance.value -= newValue;
  }

  function addWinnerBet(payload: number) {
    winnerBet.value = [...winnerBet.value, payload];
  }

  function onChangeMoneyBet(newBet: number) {
    moneyBet.value = newBet;
  }

  function onChangeTimeBet(newTimeBet: number) {
    timeBet.value = newTimeBet;
  }

  function plusMoneyBet() {
    if (moneyBet.value?.length > 6) {
      alert("error");
    } else {
      moneyBet.value++;
    }
  }

  function minusMoneyBet() {
    if (moneyBet.value <= 1 || moneyBet.value?.length > 6) {
      alert("bet cant be lower than zero");
    } else {
      moneyBet.value--;
    }
  }

  function plusTimeBet() {
    if (moneyBet.value.length > 6) {
      alert("error plus");
    } else if (!disabledTimeButton.value) {
      timeBet.value++;
    }
  }

  function minusTimeBet() {
    if (timeBet.value <= 1) {
      alert("time cant be lower than zero");
    } else if (!disabledTimeButton.value) {
      timeBet.value--;
    }
  }

  function calculationDotsArray({
    bool,
    positionFirstDot,
    dotsArray,
  }: {
    bool: boolean;
    positionFirstDot: number;
    dotsArray: any[];
  }) {
    const posFirstDot = positionFirstDot;
    winnerBetDots.value = bool
      ? dotsArray.slice(1, dotsArray.length).map((item, index) => {
          if (posFirstDot > item.yAxis) {
            balance.value +=
              Number(profitFormulaCurrency(winnerBet.value[index])) +
              moneyBet.value;
            return item;
          }
        })
      : dotsArray.slice(1, dotsArray.length).map((item, index) => {
          if (posFirstDot < item.yAxis) {
            balance.value +=
              Number(profitFormulaCurrency(winnerBet.value[index])) +
              moneyBet.value;
            return item;
          }
        });
    winnerBet.value = [];
  }

  return {
    moneyBet,
    balance,
    timeBet,
    time,
    winnerBetDots,
    winnerBet,
    disabledTimeButton,
    calculateCurrentBalance,
    addWinnerBet,
    onChangeMoneyBet,
    onChangeTimeBet,
    plusMoneyBet,
    minusMoneyBet,
    plusTimeBet,
    minusTimeBet,
    calculationDotsArray,
  };
});
