<template>
  <div class="app">
<!--    <select class="app-select" @change="changeSelect">-->
<!--      <option v-for="item in select" :key="item.key">-->
<!--        {{ item.value }}-->
<!--      </option>-->
<!--    </select>-->
    <v-chart :style="{height: '700px'}" autoresize :option="chartData"/>
  </div>
</template>
<script>

import {ref} from "vue";
import * as echarts from 'echarts'
import {selectKeys, selectValues} from "@/utils/socketLinks/socketLinks";
import {graphicColors} from "@/UI/UI-colors/graphic-colors";

export default {
  setup() {
    const price = ref(0)
    const labels = ref([])
    const dataPoints = ref([])
    const data = ref([])

    const select = ref([
      {key: selectKeys.BTC_KEY, value: selectValues.BTC_KEY_VALUE},
      {key: selectKeys.ETH_KEY, value: selectValues.ETH_KEY_VALUE},
      {key: selectKeys.SOL_KEY, value: selectValues.SOL_KEY_VALUE},
      {key: selectKeys.BNB_KEY, value: selectValues.BNB_KEY_VALUE},
    ])

    const selectedValue = ref('btc')

    const changeSelect = (e) => {
      switch (e.target.value) {
        case selectValues.BTC_KEY_VALUE:
          selectedValue.value = selectKeys.BTC_KEY
          break;
        case selectValues.ETH_KEY_VALUE:
          selectedValue.value = selectKeys.ETH_KEY
          break;
        case selectValues.SOL_KEY_VALUE:
          selectedValue.value = selectKeys.SOL_KEY
          break;
        case selectValues.BNB_KEY_VALUE:
          selectedValue.value = selectKeys.BNB_KEY
          break;
      }
    }

    const dataConvert = () => {
      const date = new Date()
      const hours = date.getHours()
      const minuts = date.getMinutes() < 9 ? '0' + date.getMinutes() : date.getMinutes()
      const seconds = date.getSeconds()
      return hours + ':' + minuts + ':' + seconds
    }

    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedValue.value}usdt@kline_1s`)
    ws.onmessage = (event) => {
      data.value = JSON.parse(event.data)
      grabData(data.value)
      generateLabels()
      calculateMinAxis()
    }

    const grabData = (data) => {
      const price = data.k.o
      dataPoints.value = [...dataPoints.value, price]
      chartData.value.series[0].data = dataPoints.value
      chartData.value.series[0].markLine.data[0].yAxis = price // add horizontal line with current price
      // changeSelect
      chartData.value.series[0].markPoint.data[0].yAxis = price // add  point

    }

    const generateLabels = () => {
      labels.value = [...labels.value, dataConvert()]
      chartData.value.xAxis.data = labels.value
      //changeSelect
      chartData.value.series[0].markPoint.data[0].xAxis = dataConvert() // add point
    }

    const calculateMinAxis = () => {
      chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data)
      return chartData.value.yAxis.min
    }

    const chartData = ref({
      title: {
        text: 'BTC/USDT',
        textStyle: {
          color: '#fff'
        }
      },
      symbol: 'none',
      dataZoom: [ //add zoom
        {
          type: 'inside',
          start: 0,
        },
      ],
      tooltip: {
        // trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            type: 'solid'
          },
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
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
          color: 'white'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: graphicColors.HORIZONTAL_LINES
          },
        }
      },
      series: [{
        type: 'line',
        showSymbol: false,
        symbol: 'none',
        data: [],
        markPoint: { //add point to line
          data: [
            {
              yAxis: null,
              xAxis: null
            },
          ],
          animation: true,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#7ABD63'
          },
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
              color: graphicColors.GRAPHIC_SHADOW[0]
            }
          ])
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            {
              yAxis: null,
              tooltip:{
                show: false,
              },
              label: {
                show: true,
                distance: 7,
                color: "black",
                backgroundColor: "white",
                position: "end",
                padding: [7, 9, 9, 7],
                formatter: (params) => {
                  return `${params.data.value}`;
                },
                fontSize: 12,
              },
              lineStyle: {
                type: "solid",
                width: 1,
                color: '#B09EFF',
              },
            },
            {
              label: {
                position: 'end',
                formatter: (params) => {
                  return `Average: ${params.data.value}`
                }
              },
              type: 'average',
              tooltip:{
                show: false,
              }
            },
            {
              label: {
                position: 'end',
                formatter: (params) => {
                  return `Max Price: ${params.data.value}`
                }
              },
              type: 'max',
              tooltip:{
                show: false,
              }
            },
          ],
        }
      }]
    })

    return {price, chartData, changeSelect, select}
  }
}
</script>
<style lang="scss">
.app {
  background: #151F30;
  height: 1500px;
}
</style>
