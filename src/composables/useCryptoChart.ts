import axios from "axios";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { apiLinks } from "@/core-data/api-links";
import { formatNumber } from "@/utils/format-float";
import { dateConvert } from "@/utils/parse-date";
import { store } from "@/store";
import getChartData from "@/utils/chartData";

export const useCryptoChart = () => {
  const loading = ref(false);
  const price = ref(0); // price cryprocurrency for labels
  const labels = ref([]); // all xAxis
  const dataPoints = ref([]); // all yAxis
  const data = ref([]); // data which return webscoket
  const click = ref(false); // need for buttons
  const clickPosition = ref({
    // need for create dots
    x: 0,
    y: 0,
  });
  const windowWidth = ref(window.innerWidth);
  const typeChart = ref("line");
  const activeClass = ref(true);

  const gridChart = () => {
    windowWidth.value = window.innerWidth;
    if (windowWidth.value <= 370) {
      chartData.value.grid.left = "14%";
    }
    if (windowWidth.value <= 425) {
      chartData.value.grid.left = "12%";
    }
  };

  const chartData = ref(getChartData(typeChart.value));

  // arr with position every dots
  const dotsArray = ref(chartData.value.series[0].markPoint.data);
  // arr with position every lines
  const linesArray = ref(chartData.value.series[0].markLine.data);

  // for select coins
  const selectedValue = ref("btc");

  const colorMarker = ref("");

  let ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${selectedValue.value}usdt@kline_1s`
  );
  ws.onmessage = (event) => {
    data.value = JSON.parse(event.data);
    grabData(data.value);
    generateLabels();
    calculateMinAxis();
    gridChart();
  };

  const grabData = ({ k }: any) => {
    console.log(k, "k");
    if (typeChart.value === "line") {
      price.value = formatNumber(k.o);
      // @ts-ignore
      dataPoints.value = [...dataPoints.value, price.value];
      chartData.value.series[0].data = dataPoints.value;
      chartData.value.series[0].markLine.data[0].yAxis = price.value; // add horizontal line with current price
      chartData.value.series[0].markPoint.data[0].yAxis = price.value; // add  point to end line
    }
    if (typeChart.value === "candlestick") {
      // @ts-ignore
      price.value = [k.o, k.c, k.l, k.h];
      // @ts-ignore
      dataPoints.value.push(price.value);
      chartData.value.series[0].data = dataPoints.value;
    }
    chartData.value.title.subtext = formatNumber(Number(k.o)); // show price sub pair/name
    chartData.value.title.text = selectedValue.value.toUpperCase() + "/USDT"; // show  pair/name
  };

  const newDot = computed(() => ({
    //create a new DOt
    yAxis: clickPosition.value.y,
    xAxis: clickPosition.value.x,
    animation: true,
    // symbol: 'circle',
    symbolSize: 40,
    itemStyle: {
      color: colorMarker.value,
    },
    label: {
      show: true,
      formatter: function (params: any) {
        return `${store.state.winnerBet[params.dataIndex - 1]}`; // get a bet$ for every dot
      },
    },
  }));
  const newDotForCandle = computed(() => ({
    //create a new Dot
    coord: [clickPosition.value.x, clickPosition.value.y],
    animation: true,
    symbolSize: 40,
    itemStyle: {
      color: colorMarker.value,
    },
    label: {
      show: true,
      formatter: function (params: any) {
        return `${store.state.winnerBet[params.dataIndex - 1]}`; // get a bet$ for every dot
      },
    },
  }));

  const newLine = computed(() => ({
    // create line for Dot
    yAxis: clickPosition.value.y,
    tooltip: {
      show: false,
    },
    lineStyle: {
      type: "dashed",
      width: 1,
      color: null,
    },

    label: {
      show: true,
      opacity: 0.4,
      distance: 7,
      color: "white",
      position: "start",
      formatter: (params: any) => {
        return `${formatNumber(Number(params.data.value))}`;
      },
    },
  }));

  const getPos = () => {
    if (typeChart.value === "line") {
      clickPosition.value = {
        // @ts-ignore
        x: (chartData.value.series[0].markPoint.data[0].xAxis = dateConvert()),
        y: (chartData.value.series[0].markPoint.data[0].yAxis = price.value),
      };
    }
    if (typeChart.value === "candlestick") {
      clickPosition.value = {
        // @ts-ignore
        x: (chartData.value.series[0].markPoint.data[0].xAxis = dateConvert()),
        // @ts-ignore
        y: (chartData.value.series[0].markPoint.data[0].yAxis = price.value[0]),
      };
    }
  };

  const positiveNewDot = () => {
    if (
      store.state.moneyBet >= store.state.balance ||
      store.state.moneyBet == 0 ||
      store.state.moneyBet.length > 5
    ) {
      alert("error");
      return false;
    }
    getPos(); //get yAxis, xAxis\
    colorMarker.value = "green";
    store.commit("addWinnerBet", store.state.moneyBet);
    if (typeChart.value === "line") {
      // @ts-ignore
      dotsArray.value.push(newDot.value); //create dot
      // @ts-ignore
      linesArray.value.push(newLine.value); // create line for dot
    }
    if (typeChart.value === "candlestick") {
      // @ts-ignore
      dotsArray.value.push(newDotForCandle.value); //create dot
      dotsArray.value[0].symbol = "none";
    }
    store.commit("calculateCurrentBalance", store.state.moneyBet);
    timer(true);
  };

  const negativeNewDot = () => {
    if (
      store.state.moneyBet >= store.state.balance ||
      store.state.moneyBet == 0 ||
      store.state.moneyBet.length > 6
    ) {
      alert("error");
      return false;
    }
    getPos();
    colorMarker.value = "red";
    if (typeChart.value === "line") {
      // @ts-ignore
      dotsArray.value.push(newDot.value); //create dot
      // @ts-ignore
      linesArray.value.push(newLine.value); // create line for dot
    }
    if (typeChart.value === "candlestick") {
      // @ts-ignore
      dotsArray.value.push(newDotForCandle.value); //create dot
    }
    store.commit("addWinnerBet", store.state.moneyBet);
    store.commit("calculateCurrentBalance", store.state.moneyBet);
    timer(false);
  };

  const timer = (bool: any) => {
    if (!click.value) {
      click.value = true;
      const interval = setInterval(() => {
        if (store.state.time >= store.state.timeBet) {
          store.commit("clearTime");
          click.value = false;
          calcAllDots(bool);
          dotsArray.value.splice(
            1,
            chartData.value.series[0].markPoint.data.length
          ); //remove dots excluding main dots
          linesArray.value.splice(
            3,
            chartData.value.series[0].markLine.data.length
          ); //remove lines excluding main line
          store.commit("toggleDisabledTimeButton", false);
          return clearInterval(interval);
        }
        store.commit("incomeTime");
        store.commit("toggleDisabledTimeButton", true);
      }, 1000);
    }
  };

  const calcAllDots = (bool: any) => {
    const positionFirstDot = chartData.value.series[0].markPoint.data[0].yAxis;
    store.commit("calcAllDots", {
      bool,
      positionFirstDot,
      dotsArray: dotsArray.value,
    });
  };

  const generateLabels = () => {
    // @ts-ignore
    labels.value = [...labels.value, dateConvert()];
    chartData.value.xAxis.data = labels.value;
    // @ts-ignore
    chartData.value.series[0].markPoint.data[0].xAxis = dateConvert(); // add point to end line
  };

  const calculateMinAxis = () => {
    // @ts-ignore
    chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data);
    return chartData.value.yAxis.min;
  };

  const clearDataForNewGraphic = () => {
    store.commit("clearWinnerBetDots");
    store.commit("clearWinnerBet");
    store.commit("clearMoneyBet");
    store.commit("clearTimeBet");
    dataPoints.value = [];
    labels.value = [];
    if (typeChart.value === "candlestick") {
      linesArray.value[0].label.show = false;
      linesArray.value[0].lineStyle.width = 0;
      dotsArray.value[0].symbol = "none";
    }
    if (typeChart.value === "line") {
      linesArray.value[0].label.show = true;
      linesArray.value[0].lineStyle.width = 1;
      dotsArray.value[0].symbol = "circle";
    }
  };

  const fetchStarterGraphic = async (
    times = 120,
    interval = "1s",
    symbol = selectedValue.value
  ) => {
    const correctedSymbol = symbol.toUpperCase() + "USDT";
    loading.value = true;
    const { data } = await axios.get(apiLinks.PAIR_USDT_API, {
      params: {
        limit: times, // length of data
        interval: interval,
        symbol: correctedSymbol,
      },
    });
    loading.value = false; // true when axios return response
    if (typeChart.value === "line") {
      data.forEach(([xAxis, yAxis]: any) => {
        // @ts-ignore
        dataPoints.value.push(yAxis);
        // @ts-ignore
        labels.value.push(dayjs(xAxis).format("HH:mm:ss"));
      });
    }
    if (typeChart.value === "candlestick") {
      data.forEach(([openTime, open, high, low, close]: any) => {
        // @ts-ignore
        dataPoints.value.push([open, close, low, high]);
        // @ts-ignore
        labels.value.push(dayjs(openTime).format("HH:mm:ss"));
      });
    }
  };

  const webSocketRelaunch = async () => {
    ws.onclose = function () {
      console.log("WebSocket is closed now.");
    };
    ws.close();
    clearDataForNewGraphic();
    await fetchStarterGraphic(120, "1s", selectedValue.value);
    ws = new WebSocket(
      `${apiLinks.WEB_SOCKET_LINK}${selectedValue.value}usdt@kline_1s`
    );
    ws.onmessage = (event) => {
      data.value = JSON.parse(event.data);
      grabData(data.value);
      generateLabels();
      calculateMinAxis();
    };
  };

  return {
    fetchStarterGraphic,
    webSocketRelaunch,
    positiveNewDot,
    negativeNewDot,
    selectedValue,
    typeChart,
    loading,
    activeClass,
    chartData,
  };
};
