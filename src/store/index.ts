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

  const calculateCurrentBalance = (newValue: number) => {
    balance.value -= newValue;
  };

  const addWinnerBet = (payload: number) => {
    winnerBet.value = [...winnerBet.value, payload];
  };

  const onChangeMoneyBet = (newBet: number) => {
    moneyBet.value = newBet;
  };

  const onChangeTimeBet = (newTimeBet: number) => {
    timeBet.value = newTimeBet;
  };

  const plusMoneyBet = () => {
    if (moneyBet.value?.length > 6) {
      alert("error");
    } else {
      moneyBet.value++;
    }
  };

  const minusMoneyBet = () => {
    if (moneyBet.value <= 1 || moneyBet.value?.length > 6) {
      alert("bet cant be lower than zero");
    } else {
      moneyBet.value--;
    }
  };

  const plusTimeBet = () => {
    if (moneyBet.value.length > 6) {
      alert("error plus");
    } else if (!disabledTimeButton.value) {
      timeBet.value++;
    }
  };

  const minusTimeBet = () => {
    if (timeBet.value <= 1) {
      alert("time cant be lower than zero");
    } else if (!disabledTimeButton.value) {
      timeBet.value--;
    }
  };

  const calculationDotsArray = ({
    bool,
    positionFirstDot,
    dotsArray,
  }: {
    bool: boolean;
    positionFirstDot: number;
    dotsArray: any[];
  }) => {
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
  };

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
