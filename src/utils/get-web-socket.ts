export const getChartWebSocketLink = (cryptoPair: string): string =>
  `wss://stream.binance.com:9443/ws/${cryptoPair}usdt@kline_1s`;
