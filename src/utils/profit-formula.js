import {store} from "@/store";

export const profitFormulaCurrency = (bet = 1, percent = store.state.percentForProfit) => {
    return  (percent /  100 * Number(bet)).toFixed(2)
}
