import { createStore } from "vuex";
import { profitFormulaCurrency } from "@/utils/profit-formula";

interface RootState {
  moneyBet: any;
  balance: number;
  timeBet: number;
  time: number;
  percentForProfit: number;
  winnerBetDots: any[]; // Update with the actual type
  winnerBet: any[]; // Update with the actual type
  disabledTimeButton: boolean;
  selectedValue: string;
}

export const store = createStore<RootState>({
  state() {
    return {
      moneyBet: 1,
      balance: 10000,
      timeBet: 4,
      time: 0,
      percentForProfit: 86,
      winnerBetDots: [],
      winnerBet: [],
      disabledTimeButton: false,
      selectedValue: "btc",
    };
  },
  mutations: {
    calculateCurrentBalance(state, action) {
      state.balance -= action;
    },
    addWinnerBet(state, payload) {
      state.winnerBet = [...state.winnerBet, payload];
    },
    toggleDisabledTimeButton(state, payload) {
      state.disabledTimeButton = payload;
    },
    incomeTime(state) {
      state.time++;
    },
    clearTime(state) {
      state.time = 0;
    },
    clearWinnerBetDots(state) {
      state.winnerBetDots = [];
    },
    clearWinnerBet(state) {
      state.winnerBet = [];
    },
    clearMoneyBet(state) {
      state.moneyBet = 1;
    },
    clearTimeBet(state) {
      state.timeBet = 4;
    },
    onChangeMoneyBet(state, payload) {
      state.moneyBet = +payload;
    },
    onChanheTimeBet(state, payload) {
      state.timeBet = +payload;
    },
    plusMoneyBet(state) {
      if (state.moneyBet.length > 6) {
        alert("error");
      } else {
        state.moneyBet++;
      }
    },
    minusMoneyBet(state) {
      if (state.moneyBet <= 1 || state.moneyBet.length > 6) {
        alert("bet cant be lower than zero");
      } else {
        state.moneyBet--;
      }
    },
    plusTimeBet(state) {
      if (state.moneyBet.length > 6) {
        alert("error plus");
      } else if (!state.disabledTimeButton) {
        state.timeBet++;
      }
    },
    minusTimeBet(state) {
      if (state.timeBet <= 1) {
        alert("time cant be lower than zero");
      } else if (!state.disabledTimeButton) {
        state.timeBet--;
      }
    },
    calcAllDots(state, { bool, positionFirstDot, dotsArray }) {
      const posFirstDot = positionFirstDot;
      state.winnerBetDots = bool
        ? dotsArray
            .slice(1, dotsArray.length)
            .map((item: any, index: number) => {
              if (posFirstDot > item.yAxis) {
                state.balance +=
                  Number(profitFormulaCurrency(state.winnerBet[index])) +
                  state.moneyBet;
                return item;
              }
            })
        : dotsArray
            .slice(1, dotsArray.length)
            .map((item: any, index: number) => {
              if (posFirstDot < item.yAxis) {
                state.balance +=
                  Number(profitFormulaCurrency(state.winnerBet[index])) +
                  state.moneyBet;
                return item;
              }
            });
      state.winnerBet = [];
    },
  },
});
