import { DEFAULT_PROFIT_PERCENT } from "@/constants/chart";

export const profitFormulaCurrency = (
  bet = 1,
  percent = DEFAULT_PROFIT_PERCENT
) => {
  return ((percent / 100) * Number(bet)).toFixed(2);
};
