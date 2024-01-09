import { ChartType } from "@/types/crypto-chart-types";

export const CHART_TYPE: ChartType = Object.freeze({
  LINE: "line",
  CANDLESTICK: "candlestick",
});

export const CHART_MARKER_COLOR = Object.freeze({
  POSITIVE: "green",
  NEGATIVE: "red",
});

export const DEFAULT_TIME_BET = 4;

export const DEFAULT_PROFIT_PERCENT = 86;

export const DEFAULT_USER_BALANCE = 10000;

export const DEFAULT_BET = 1;
