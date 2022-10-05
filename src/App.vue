<template>
  <div class="app">
    <!--    <select class="app-select" @change="changeSelect">-->
    <!--      <option v-for="item in select" :key="item.key">-->
    <!--        {{ item.value }}-->
    <!--      </option>-->
    <!--    </select>-->
    <v-chart :style="{height: '700px' ,}" autoresize :option="chartData"/>
    <div class="app-btn">
      <button class="btn btn__hight" @click="createNewDot">Higher</button>
      <button class="btn btn__lower" @click="createNewDot">Lower</button>
    </div>
  </div>
</template>
<script>

import { ref} from "vue";
import * as echarts from 'echarts'
import {selectKeys, selectValues} from "@/utils/socketLinks/socketLinks";
import {graphicColors} from "@/UI/UI-colors/graphic-colors";
import {formatNumber} from "@/utils/formater/formatFloat";

export default {
  setup() {
    const price = ref(0)
    const labels = ref([])
    const dataPoints = ref([])
    const data = ref([])

    const clickPosition = ref({
      x: 0,
      y: 0
    })

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
      const seconds = date.getSeconds() < 9 ? '0' + date.getSeconds() : date.getSeconds()
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
      price.value = formatNumber(data.k.o,4)
      dataPoints.value = [...dataPoints.value, price.value]
      chartData.value.series[0].data = dataPoints.value
      chartData.value.series[0].markLine.data[0].yAxis =  price.value // add horizontal line with current price
      chartData.value.series[0].markPoint.data[0].yAxis = price.value// add  point to end line
      chartData.value.title.subtext = formatNumber(+price.value,4) // show price sub pair/name
    }

    const getPos = () => {
      clickPosition.value = {
        x: chartData.value.series[0].markPoint.data[0].xAxis = dataConvert(),
        y: chartData.value.series[0].markPoint.data[0].yAxis = price.value
      }
    }

    const createNewDot = () => {

      getPos();
      chartData.value.series[0].markPoint.data[1].yAxis = clickPosition.value.y // add dot
      chartData.value.series[0].markPoint.data[1].xAxis = clickPosition.value.x // add dot
      chartData.value.series[0].markLine.data[3].yAxis =  clickPosition.value.y  // create horizontal line

    }

    const generateLabels = () => {
      labels.value = [...labels.value, dataConvert(), ]
      chartData.value.xAxis.data = labels.value
      chartData.value.series[0].markPoint.data[0].xAxis = dataConvert() // add point to end line
    }

    const calculateMinAxis = () => {
      chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data)
      return chartData.value.yAxis.min
    }

    const chartData = ref({
      title: {
        text: 'BTC/USDT',
        subtext: '',
        subtextStyle:{
          color: '#fff',
          fontSize: 16,
        },
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
        type: 'line',
        showSymbol: false,
        symbol: 'none',
        data: [],
        markPoint: { // add point to line
          data: [
            {
              yAxis: null,
              xAxis: null,
              animation: true,
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#7ABD63'
              },
            },
            {
              yAxis: null,
              xAxis: null,
              animation: false,
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#7ABD63'
              },
            }
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
              color: graphicColors.GRAPHIC_SHADOW[0]
            }
          ])
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
              // first
            {
              yAxis: null,
              tooltip: {
                show: false,
              },
              label: {
                show: true,
                distance: 4,
                color: "#f4f6bb",
                backgroundColor: "#B9A1FF",
                position: "end",
                padding: [7, 12, 9, 7],
                formatter: (params) => {
                  return `${formatNumber(+params.data.value,4)}`;
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
                position: 'end',
                formatter: (params) => {
                  return `AVG: ${formatNumber(params.data.value,4)}`
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
                position: 'end',
                formatter: (params) => {
                  return `MAX: ${formatNumber(+params.data.value,4)}`
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
              //end third
              // fourth
            {
              yAxis: 0,
              tooltip: {
                show: true
              },
              lineStyle: {
                type: "dashed",
                width: 1,
                color: 'green',
              },
              label: {
                show: true,
                distance: 7,
                color: "white",
                position: "end",
                formatter: (params) => {
                  return `${formatNumber(+params.data.value,4)}`;
                },
              }
            },
          ],
        }
      }]
    })

    return {price, chartData, changeSelect, select, getPos, createNewDot}
  }
  }
</script>
<style lang="scss">
.app {
  background: #151F30;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn{
  cursor: pointer;
  padding: 20px 30px;
  border: none;
  border-radius: 2px;
  font-size: 18px;
  color: white;
  margin-right: 10px;
  margin-bottom: 10px;
}
.btn__hight{
  background: #35A947;
}
.btn__lower{
  background: #E34828;
}

</style>
