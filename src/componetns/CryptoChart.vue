<template>
  <main class="h-full flex w-full bg-[#151f31] justify-between items-center overflow-y-auto sm:flex-col">
    <template v-if="!loading">
      <v-chart class="w-full h-full pt-10" autoresize :option="chartData"/>
    </template>
    <template v-else>
      <div class="w-full flex justify-center h-full items-center">
        <MLoader/>
      </div>
    </template>
    <template class="  flex flex-col items-center gap-3 justify-between mr-[20px] sm:mr-[0px]">
      <aside-panel
          @changeTypeLine="changeTypeLine"
          @changeGraphic="changeGraphic"
          :positive-new-dot="positiveNewDot"
          :negative-new-dot="negativeNewDot"
          :activeClass="activeClass"
      />
    </template>
  </main>
</template>
<script>
import * as echarts from 'echarts'
import axios from 'axios'
import dayjs from "dayjs"
import {computed, onMounted, ref, watch} from "vue";
import {graphicColors} from "@/core-data/ui/graphic-colors";
import {apiLinks} from "@/core-data/api-links";
import {formatNumber} from "@/utils/format-float";
import {dateConvert} from "@/utils/parse-date";
import {profitFormulaCurrency} from "@/utils/profit-formula";
import {store} from '@/store'
import AsidePanel from "@/componetns/AsidePanel";
import MLoader from "@/componetns/ui/MLoader";

export default {
  components: {
    AsidePanel, MLoader
  },
  setup() {
    const loading = ref(false)
    const price = ref(0)  // price cryprocurrency for labels
    const labels = ref([]) // all xAxis
    const dataPoints = ref([]) // all yAxis
    const data = ref([]) // data which return webscoket
    const click = ref(false) // need for buttons
    const clickPosition = ref({ // need for create dots
      x: 0,
      y: 0
    })
    const windowWidth = ref(window.innerWidth)
    const typeChart = ref('line')
    const activeClass = ref(true)

    const gridChart = () => {
      windowWidth.value = window.innerWidth
      if (windowWidth.value <= 370) {
        chartData.value.grid.left = '14%'
      }
      if (windowWidth.value <= 425) {
        chartData.value.grid.left = '12%'
      }
    }

    const chartData = ref({
      title: {
        text: 'BTC/USDT',
        subtext: '',
        left: 'center',
        padding: [0, 0, 0, 90],
        subtextStyle: {
          color: '#BABAD2',

          fontSize: 16,
        },
        textStyle: {
          color: '#fff'
        }
      },
      symbol: 'none',
      grid: {
        left: '10%'
      },
      dataZoom: [ //add zoom
        {
          type: 'inside',
          start: 0,
        },
      ],
      tooltip: {
        axisPointer: {
          type: 'cross',
          crossStyle: {
            type: 'solid'
          },
          label: {
            backgroundColor: '#6a7985'
          }
        },
        extraCssText:'text-transform: uppercase'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: { //add axisX text color
          color: 'white'
        },
        data: [],
        splitLine: {
          show: true,
          lineStyle: {
            color: graphicColors.VERTICAL_LINES
          },
        }
      },
      yAxis: {
        type: 'value',
        min: null,
        axisLabel: { //add axisY text color
          color: 'white',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: graphicColors.HORIZONTAL_LINES,
          },
        },
      },
      series: [{
        type: typeChart.value,
        showSymbol: false,
        symbol: 'none',
        data: [],
        markPoint: { // add point to line
          data: [
            {
              yAxis: 0,
              xAxis: 0,
              animation: true,
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: '#7ABD63',
              },
            },
          ],
        },
        lineStyle: {
          color: graphicColors.GRAPHIC_LINE
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: graphicColors.GRAPHIC_SHADOW[0],
            },
            {
              offset: 1,
              color: graphicColors.GRAPHIC_SHADOW[1]
            }
          ])
        },
        markLine: {
          symbolRotate: 90,
          symbolSize: [28, 20],
          symbol: ['none', 'none'],
          data: [
            // first
            {
              yAxis: 0,
              tooltip: {
                show: false,
              },
              label: {
                opacity: 1,
                show: true,
                distance: 4,
                color: "#f4f6bb",
                backgroundColor: "#B9A1FF",
                position: "end",
                padding: [7, 12, 9, 7],
                formatter: (params) => {
                  if (!params.data.value) return ''
                  return `${formatNumber(Number(params.data.value))}`;
                },
                fontSize: 12
              },
              lineStyle: {
                type: "solid",
                width: 1,
                color: '#B09EFF',
              },
            },
            //end first
            // second
            {
              lineStyle: {
                type: "dashed",
                width: 1,
                color: 'gray',
              },
              label: {
                opacity: 0.3,
                position: 'end',
                formatter: (params) => {
                  return `AVG: ${formatNumber(params.data.value)}`
                },
                color: 'white'
              },
              type: 'average',
              tooltip: {
                show: false,
              }
            },
            //end second
            // third
            {
              label: {
                opacity: 0.3,
                position: 'end',
                formatter: (params) => {
                  return `MAX: ${formatNumber(Number(params.data.value))}`
                },
                color: 'white'
              },
              type: 'max',
              tooltip: {
                show: false,
              },
              lineStyle: {
                type: "dashed",
                width: 1,
                color: 'gray',
              },
            },
          ],
        }
      }]
    })
    // arr with position every dots
    const dotsArray = ref(chartData.value.series[0].markPoint.data)
    // arr with position every lines
    const linesArray = ref(chartData.value.series[0].markLine.data)

    // for select coins
    const selectedValue = ref('btc')

    const changeGraphic = (value) => {
      selectedValue.value = value
    }
    const changeTypeLine = (value) => {
      activeClass.value = value === 'line' ? true : false
      typeChart.value = value
      chartData.value.series[0].type = typeChart.value
    }

    const colorMarker = ref('')

    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedValue.value}usdt@kline_1s`)
    ws.onmessage = (event) => {
      data.value = JSON.parse(event.data)
      grabData(data.value)
      generateLabels()
      calculateMinAxis()
      gridChart()
    }

    const grabData = ({k}) => {
      if (typeChart.value === 'line') {
        price.value = formatNumber(k.o)
        dataPoints.value = [...dataPoints.value, price.value]
        chartData.value.series[0].data = dataPoints.value
        chartData.value.series[0].markLine.data[0].yAxis = price.value // add horizontal line with current price
        chartData.value.series[0].markPoint.data[0].yAxis = price.value// add  point to end line
      }
      if (typeChart.value === 'candlestick') {
        price.value = [k.o, k.c, k.l, k.h]
        dataPoints.value.push(price.value)
        chartData.value.series[0].data = dataPoints.value

      }
      chartData.value.title.subtext = formatNumber(Number(k.o)) // show price sub pair/name
      chartData.value.title.text = selectedValue.value.toUpperCase() + '/USDT' // show  pair/name
    }

    const newDot = computed(() => ({//create a new DOt
      yAxis: clickPosition.value.y,
      xAxis: clickPosition.value.x,
      animation: true,
      // symbol: 'circle',
      symbolSize: 40,
      itemStyle: {
        color: colorMarker.value
      },
      label: {
        show: true,
        formatter: function (params) {
          return `${store.state.winnerBet[params.dataIndex - 1]}` // get a bet$ for every dot
        }
      }
    }))
    const newDotForCandle = computed(() => ({//create a new DOt
      coord: [clickPosition.value.x, clickPosition.value.y],
      animation: true,
      symbolSize: 40,
      itemStyle: {
        color: colorMarker.value
      },
      label: {
        show: true,
        formatter: function (params) {
          return `${store.state.winnerBet[params.dataIndex - 1]}` // get a bet$ for every dot
        }
      }
    }))

    const newLine = computed(() => ({ // create line for Dot
      yAxis: clickPosition.value.y,
      tooltip: {
        show: false
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
        formatter: (params) => {
          return `${formatNumber(Number(params.data.value))}`;
        },
      }
    }))

    const getPos = () => {
      if (typeChart.value === 'line') {
        clickPosition.value = {
          x: chartData.value.series[0].markPoint.data[0].xAxis = dateConvert(),
          y: chartData.value.series[0].markPoint.data[0].yAxis = price.value
        }
      }
      if (typeChart.value === 'candlestick') {
        clickPosition.value = {
          x: chartData.value.series[0].markPoint.data[0].xAxis = dateConvert(),
          y: chartData.value.series[0].markPoint.data[0].yAxis = price.value[0]
        }
      }
    }

    const positiveNewDot = () => {
      if (store.state.moneyBet >= store.state.balance || store.state.moneyBet == 0 || store.state.moneyBet.length > 5) {
        alert('error')
        return false
      }
      getPos(); //get yAxis, xAxis\
      colorMarker.value = 'green'
      store.commit('addWinnerBet', store.state.moneyBet)
      if (typeChart.value === 'line') {
        dotsArray.value.push(newDot.value) //create dot
        linesArray.value.push(newLine.value) // create line for dot
      }
      if (typeChart.value === 'candlestick') {
        dotsArray.value.push(newDotForCandle.value) //create dot
        dotsArray.value[0].symbol = 'none'
      }
      store.commit('calculateCurrentBalance', store.state.moneyBet)
      timer(true)
    }

    const negativeNewDot = () => {
      if (store.state.moneyBet >= store.state.balance || store.state.moneyBet == 0 || store.state.moneyBet.length > 6) {
        alert('error')
        return false
      }
      getPos();
      colorMarker.value = 'red'
      if (typeChart.value === 'line') {
        dotsArray.value.push(newDot.value) //create dot
        linesArray.value.push(newLine.value) // create line for dot
      }
      if (typeChart.value === 'candlestick') {
        dotsArray.value.push(newDotForCandle.value) //create dot
      }
      store.commit('addWinnerBet', store.state.moneyBet)
      store.commit('calculateCurrentBalance', store.state.moneyBet)
      timer(false)
    }

    const timer = (bool) => {
      if (!click.value) {
        click.value = true
        const interval = setInterval(() => {
          if (store.state.time >= store.state.timeBet) {
            store.commit('clearTime')
            click.value = false
            calcAllDots(bool)
            dotsArray.value.splice(1, chartData.value.series[0].markPoint.data.length) //remove dots excluding main dots
            linesArray.value.splice(3, chartData.value.series[0].markLine.data.length)//remove lines excluding main line
            store.commit('toggleDisabledTimeButton', false)
            return clearInterval(interval)

          }
          store.commit('incomeTime')
          store.commit('toggleDisabledTimeButton', true)
        }, 1000)
      }
    }

    const calcAllDots = (bool) => {
      const positionFirstDot = chartData.value.series[0].markPoint.data[0].yAxis
      store.commit('calcAllDots', {bool, positionFirstDot, dotsArray: dotsArray.value})
    }

    const generateLabels = () => {
      labels.value = [...labels.value, dateConvert()]
      chartData.value.xAxis.data = labels.value
      chartData.value.series[0].markPoint.data[0].xAxis = dateConvert() // add point to end line
    }

    const calculateMinAxis = () => {
      chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data)
      return chartData.value.yAxis.min
    }

    const clearDataForNewGraphic = () => {
      store.commit('clearWinnerBetDots')
      store.commit('clearWinnerBet')
      store.commit('clearMoneyBet')
      store.commit('clearTimeBet')
      dataPoints.value = []
      labels.value = []
      if (typeChart.value === 'candlestick') {
        linesArray.value[0].label.show = false
        linesArray.value[0].lineStyle.width = 0
        dotsArray.value[0].symbol = 'none'
      }
      if (typeChart.value === 'line') {
        linesArray.value[0].label.show = true
        linesArray.value[0].lineStyle.width = 1
        dotsArray.value[0].symbol = 'circle'
      }
    }

    const fetchStarterGraphic = async (times = 120, interval = '1s', symbol = selectedValue.value) => {
      const correctedSymbol = symbol.toUpperCase() + 'USDT'
      loading.value = true
      const {data} = await axios.get(apiLinks.PAIR_USDT_API, {
        params: {
          limit: times, // length of data
          interval: interval,
          symbol: correctedSymbol
        }
      })
      loading.value = false // true when axios return response
      if (typeChart.value === 'line') {
        data.forEach(([xAxis, yAxis]) => {
          dataPoints.value.push(yAxis);
          labels.value.push(dayjs(xAxis).format('HH:mm:ss'))
        })
      }
      if (typeChart.value === 'candlestick') {
        data.forEach(([openTime, open, high, low, close]) => {
          dataPoints.value.push([open, close, low, high]);
          labels.value.push(dayjs(openTime).format('HH:mm:ss'))
        })
      }
    }

    const webSocketRelaunch = () => {
      ws.onclose = function () {
      }
      ws.close()
      clearDataForNewGraphic()
      fetchStarterGraphic(120, '1s', selectedValue.value)
      ws = new WebSocket(`${apiLinks.WEB_SOCKET_LINK}${selectedValue.value}usdt@kline_1s`)
      ws.onmessage = (event) => {
        data.value = JSON.parse(event.data)
        grabData(data.value)
        generateLabels()
        calculateMinAxis()
      }
    }

    onMounted(async () => {
      await fetchStarterGraphic()
    })

    watch(selectedValue, () => {
      webSocketRelaunch()
    })

    watch(typeChart, () => {
      webSocketRelaunch()
    })

    return {
      changeGraphic,
      loading,
      price,
      chartData,
      profitFormulaCurrency,
      formatNumber,
      selectedValue,
      changeTypeLine,
      getPos, activeClass,
      positiveNewDot,
      negativeNewDot,
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
