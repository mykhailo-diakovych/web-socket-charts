import axios from "axios";
import dayjs from "dayjs";
import { computed, ref } from "vue";
import { API_LINKS } from "@/constants/api-links";
import { formatNumber } from "@/utils/format-float";
import { dateConvert } from "@/utils/parse-date";
import { useChartStore } from "@/store";
import getChartData from "@/utils/chart-data";
import {
  ChartTypeValue,
  ClickPosition,
  LabelFormatterEntity,
  WebSocketDataK,
} from "@/types/crypto-chart-types";
import { DotsArray } from "@/types/crypto-chart-types/dots";
import {
  CHART_MARKER_COLOR,
  CHART_TYPE,
  DEFAULT_TIME_BET,
} from "@/constants/chart";
import { SELECT_KEYS } from "@/constants/select-options";
import { getChartWebSocketLink } from "@/utils/get-web-socket";
import { storeToRefs } from "pinia";

export const useCryptoChart = () => {
  const {
    moneyBet,
    balance,
    time,
    timeBet,
    disabledTimeButton,
    winnerBetDots,
    winnerBet,
  } = storeToRefs(useChartStore());

  const { calculateCurrentBalance, addWinnerBet, calculationDotsArray } =
    useChartStore();
  const loading = ref(false);
  const cryptoPrice = ref<number[] | number>(0); // price cryptocurrency for labels
  const labels = ref<string[]>([]); // all xAxis values
  const dataPoints = ref<string[][]>([]); // all yAxis values
  const webSocketData = ref([]); // data which return webscoket
  const isClick = ref(false);
  const clickPosition = ref<ClickPosition>({
    // for create dots
    x: 0,
    y: 0,
  });
  const windowWidth = ref(window.innerWidth);
  const typeChart = ref<ChartTypeValue>(CHART_TYPE.LINE);
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
  const dotsArray = ref<DotsArray>(chartData.value.series[0].markPoint.data);
  // arr with position every lines
  const linesArray = ref(chartData.value.series[0].markLine.data);

  // for select coins
  const selectedCryptoPair = ref(SELECT_KEYS.BTC_KEY);

  const colorMarker = ref("");

  let ws = new WebSocket(getChartWebSocketLink(selectedCryptoPair.value));

  ws.onmessage = (event) => {
    webSocketData.value = JSON.parse(event.data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    grabData(webSocketData.value.k);
    generateLabels();
    calculateMinAxis();
    gridChart();
  };

  const grabData = (k: WebSocketDataK) => {
    if (typeChart.value === CHART_TYPE.LINE) {
      cryptoPrice.value = formatNumber(k.o);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataPoints.value = [...dataPoints.value, cryptoPrice.value];
      chartData.value.series[0].data = dataPoints.value;
      chartData.value.series[0].markLine.data[0].yAxis = cryptoPrice.value; // add horizontal line with current price
      chartData.value.series[0].markPoint.data[0].yAxis = cryptoPrice.value; // add  point to end line
    }
    if (typeChart.value === CHART_TYPE.CANDLESTICK) {
      cryptoPrice.value = [k.o, k.c, k.l, k.h];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dataPoints.value.push(cryptoPrice.value);
      chartData.value.series[0].data = dataPoints.value;
    }
    chartData.value.title.subtext = formatNumber(Number(k.o)); // show price sub pair/name
    chartData.value.title.text =
      selectedCryptoPair.value.toUpperCase() + "/USDT"; // show  pair/name
  };

  const getSameDotOptions = () => {
    return {
      animation: true,
      symbolSize: 40,
      itemStyle: {
        color: colorMarker.value,
      },
      label: {
        show: true,
        formatter: function (params: LabelFormatterEntity) {
          return `${winnerBet.value[params.dataIndex - 1]}`; // get a bet$ for every dot
        },
      },
    };
  };
  const newDot = computed(() => ({
    //create a new Dot
    yAxis: clickPosition.value.y,
    xAxis: clickPosition.value.x,
    ...getSameDotOptions(),
  }));
  const newDotForCandle = computed(() => ({
    //create a new Dot
    coord: [clickPosition.value.x, clickPosition.value.y],
    ...getSameDotOptions(),
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
      formatter: (params: LabelFormatterEntity) => {
        return `${formatNumber(Number(params.data.value))}`;
      },
    },
  }));

  const getPos = () => {
    clickPosition.value.x = chartData.value.series[0].markPoint.data[0].xAxis =
      dateConvert();
    if (typeChart.value === CHART_TYPE.LINE) {
      clickPosition.value.y =
        chartData.value.series[0].markPoint.data[0].yAxis = cryptoPrice.value;
    }
    if (typeChart.value === CHART_TYPE.CANDLESTICK) {
      clickPosition.value.y =
        chartData.value.series[0].markPoint.data[0].yAxis =
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cryptoPrice.value[0];
    }
  };

  const createNewDot = (isPositive: boolean) => {
    if (
      moneyBet.value >= balance.value ||
      moneyBet.value == 0 ||
      moneyBet.value.length > 5
    ) {
      alert("error");
      return false;
    }
    getPos(); //get yAxis, xAxis
    colorMarker.value = isPositive
      ? CHART_MARKER_COLOR.POSITIVE
      : CHART_MARKER_COLOR.NEGATIVE;
    if (typeChart.value === CHART_TYPE.LINE) {
      dotsArray.value.push(newDot.value); //create dot
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      linesArray.value.push(newLine.value); // create line for dot
    }
    if (typeChart.value === CHART_TYPE.CANDLESTICK) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dotsArray.value.push(newDotForCandle.value); //create dot
      isPositive && (dotsArray.value[0].symbol = "none");
    }

    addWinnerBet(moneyBet.value);
    calculateCurrentBalance(moneyBet.value);
    launchBetTimer(isPositive);
  };

  const positiveNewDot = () => {
    createNewDot(true);
  };

  const negativeNewDot = () => {
    createNewDot(false);
  };

  const launchBetTimer = (bool: boolean) => {
    if (!isClick.value) {
      isClick.value = true;
      const interval = setInterval(() => {
        if (time.value >= timeBet.value) {
          time.value = 0;
          isClick.value = false;
          calcAllDots(bool);
          dotsArray.value.splice(
            1,
            chartData.value.series[0].markPoint.data.length
          ); //remove dots excluding main dots
          linesArray.value.splice(
            3,
            chartData.value.series[0].markLine.data.length
          ); //remove lines excluding main line
          disabledTimeButton.value = false;
          return clearInterval(interval);
        }
        time.value++;
        disabledTimeButton.value = true;
      }, 1000);
    }
  };

  const calcAllDots = (bool: boolean) => {
    const positionFirstDot = Number(
      chartData.value.series[0].markPoint.data[0].yAxis
    );
    calculationDotsArray({
      bool,
      positionFirstDot,
      dotsArray: dotsArray.value,
    });
  };

  const generateLabels = () => {
    labels.value = [...labels.value, dateConvert()];
    chartData.value.xAxis.data = labels.value;
    chartData.value.series[0].markPoint.data[0].xAxis = dateConvert(); // add point to end line
  };

  const calculateMinAxis = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data);
    return chartData.value.yAxis.min;
  };

  const clearDataForNewGraphic = () => {
    winnerBetDots.value = [];
    winnerBet.value = [];
    moneyBet.value = 1;
    timeBet.value = DEFAULT_TIME_BET;
    dataPoints.value = [];
    labels.value = [];
    if (typeChart.value === CHART_TYPE.CANDLESTICK) {
      linesArray.value[0].label.show = false;
      linesArray.value[0].lineStyle.width = 0;
      dotsArray.value[0].symbol = "none";
    }
    if (typeChart.value === CHART_TYPE.LINE) {
      linesArray.value[0].label.show = true;
      linesArray.value[0].lineStyle.width = 1;
      dotsArray.value[0].symbol = "circle";
    }
  };

  const fetchStarterGraphic = async (
    times = 120,
    interval = "1s",
    symbol = selectedCryptoPair.value
  ) => {
    const correctedSymbol = symbol.toUpperCase() + "USDT";
    loading.value = true;
    const { data } = await axios.get(API_LINKS.PAIR_USDT_API, {
      params: {
        limit: times, // length of data
        interval: interval,
        symbol: correctedSymbol,
      },
    });
    loading.value = false; // true when axios return response
    if (typeChart.value === CHART_TYPE.LINE) {
      data.forEach(([xAxis, yAxis]: any) => {
        dataPoints.value.push(yAxis);
        labels.value.push(dayjs(xAxis).format("HH:mm:ss"));
      });
    }
    if (typeChart.value === CHART_TYPE.CANDLESTICK) {
      data.forEach(([openTime, open, high, low, close]: string) => {
        dataPoints.value.push([open, close, low, high]);
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
    await fetchStarterGraphic(120, "1s", selectedCryptoPair.value);
    ws = new WebSocket(
      `${API_LINKS.WEB_SOCKET_LINK}${selectedCryptoPair.value}usdt@kline_1s`
    );
    ws.onmessage = (event) => {
      webSocketData.value = JSON.parse(event.data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      grabData(webSocketData.value?.k);
      generateLabels();
      calculateMinAxis();
    };
  };

  return {
    fetchStarterGraphic,
    webSocketRelaunch,
    positiveNewDot,
    negativeNewDot,
    selectedCryptoPair,
    typeChart,
    loading,
    activeClass,
    chartData,
  };
};
