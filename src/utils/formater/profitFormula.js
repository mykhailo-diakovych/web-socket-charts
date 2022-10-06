export const profitFormulaCurrency = (bet = 1, percent = 86) => {
    return  (percent /  100 * Number(bet)).toFixed(2)
}
