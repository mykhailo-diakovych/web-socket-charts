export const SELECT_KEYS = Object.freeze({
  BTC_KEY: "btc",
  ETH_KEY: "eth",
  SOL_KEY: "sol",
  BNB_KEY: "bnb",
});

export const SELECT_VALUES = Object.freeze({
  BTC_KEY_VALUE: "BTC/USDT",
  ETH_KEY_VALUE: "ETH/USDT",
  SOL_KEY_VALUE: "SOL/USDT",
  BNB_KEY_VALUE: "BNB/USDT",
});

export const CRYPTO_PAIR_OPTIONS = [
  { value: SELECT_KEYS.BTC_KEY, title: SELECT_VALUES.BTC_KEY_VALUE },
  { value: SELECT_KEYS.ETH_KEY, title: SELECT_VALUES.ETH_KEY_VALUE },
  { value: SELECT_KEYS.SOL_KEY, title: SELECT_VALUES.SOL_KEY_VALUE },
  { value: SELECT_KEYS.BNB_KEY, title: SELECT_VALUES.BNB_KEY_VALUE },
];
