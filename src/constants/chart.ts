import { ChartType } from "@/types/crypto-chart-types";

export const CHART_TYPE: ChartType = Object.freeze({
  LINE: "line",
  CANDLESTICK: "candlestick",
});

export const CHART_MARKER_COLOR = Object.freeze({
  POSITIVE: "green",
  NEGATIVE: "red",
});
