<template>
  <main class="h-full flex w-full bg-[#151f31] justify-between items-center overflow-y-auto">
   <template v-if="!loading">
     <v-chart class="w-full h-full pt-10" autoresize :option="chartData"/>
   </template>
    <template v-else>
      <div class="w-full flex justify-center">
        <MyLoader></MyLoader>
      </div>
    </template>
    <aside class="  flex flex-col items-center gap-3 justify-between mr-[20px]">
      <select v-model="selectedValue" class="w-full p-[7px] text-white bg-[#151f31] border-[#3e3f45] border-2">
        <option v-for="item in allSelectOptions" :key="item.value" :value="item.value" >
          {{ item.title }}
        </option>
      </select>
      <div class="flex flex-col justify-between items-center text-[#8f8281]">
        <p>Balance:</p>
        <p class="text-blue-100 text-[19px]">{{ balance.toFixed(2) }} usd</p>
      </div>
      <div class="flex flex-col justify-between items-center text-[#8f8281]">
        <p>Timer:</p>
        <p class="text-blue-100 text-[19px]">{{ time }}</p>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex border-2 border-[#3e3f45]  text-[#8f8281] rounded-md p-2">
          <div class="w-9/12 flex flex-col">
            <label>Sum</label>
            <input :maxlength="5" v-model="moneyBet"
                   class="w-full text-white bg-[#151f31] pl-[3px] focus:outline-none focus:none cursor-pointer "
                   type="number">
          </div>
          <div class="w-3/12 flex flex-col">
            <button class="text-[18px]" @click="plusMoneyBet">+</button>
            <button class="text-[18px]" @click="minusMoneyBet">-</button>
          </div>
        </div>
        <div class="flex border-2 border-[#3e3f45]  text-[#8f8281] rounded-md p-2">
          <div class="w-9/12 flex flex-col">
            <label>Time</label>
            <input v-model='timeBet'
                   class="w-full text-white bg-[#151f31] pl-[3px] focus:outline-none focus:none cursor-pointer "
                   type="number">
          </div>
          <div class="w-3/12 flex flex-col">
            <button class="text-[18px]" @click="plusTimeBet">+</button>
            <button class="text-[18px]" @click="minusTimeBet">-</button>
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-2  justify-between text-green-500">
        <p class="text-white text-[14px]">Profit ?</p>
        <p class="text-5xl">+86%</p>
        <p class="text-[18px] font-medium">+{{ profitFormulaCurrency(moneyBet) }} dollars</p>
      </div>
      <div class="flex flex-col items-center w-full">
        <button class="button button__hight" @click="positiveNewDot">Higher</button>
        <button class="button button__lower" @click="negativeNewDot">Lower</button>
      </div>
    </aside>
  </main>
</template>
<script>

import {computed, onMounted, ref, watch} from "vue";
import * as echarts from 'echarts'
import {selectKeys, selectValues} from "@/utils/socketLinks/socketLinks";
import {graphicColors} from "@/UI/UI-colors/graphic-colors";
import {formatNumber} from "@/utils/formater/formatFloat";
import axios from 'axios'
import {dateConvert} from "@/utils/dataConvert";
import dayjs from "dayjs";
import {profitFormulaCurrency} from "@/utils/formater/profitFormula";
import MyLoader from "@/componetns/UI/MyLoader";

export default {
  components: {MyLoader},
  setup() {
    /// ui
    const moneyBet = ref(1)
    const timeBet = ref(4)
    const balance = ref(10000)
    const loading = ref(false)
    ///
    const price = ref(0)  // price cryprocurrency for labels
    const labels = ref([]) // all xAxis
    const dataPoints = ref([]) // all yAxis
    const data = ref([]) // data which return webscoket
    const time = ref(0) // timer
    const click = ref(false) // need for buttons
    const clickPosition = ref({ // need for create dots
      x: 0,
      y: 0
    })

    const winnerBetDots = ref([]) //arr where only dots which wins
    const winnerBet = ref([]) // arr where push users bets
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
              yAxis: null,
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
    const allSelectOptions = ref([
      {value: selectKeys.BTC_KEY, title: selectValues.BTC_KEY_VALUE},
      {value: selectKeys.ETH_KEY, title: selectValues.ETH_KEY_VALUE},
      {value: selectKeys.SOL_KEY, title: selectValues.SOL_KEY_VALUE},
      {value: selectKeys.BNB_KEY, title: selectValues.BNB_KEY_VALUE},
    ])

    const selectedValue = ref('btc')


    let ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedValue.value}usdt@kline_1s`)
    ws.onmessage = (event) => {
      data.value = JSON.parse(event.data)
      grabData(data.value)
      generateLabels()
      calculateMinAxis()
    }


    const grabData = (data) => {
      price.value = formatNumber(data.k.o,)
      dataPoints.value = [...dataPoints.value, price.value]
      chartData.value.series[0].data = dataPoints.value
      chartData.value.series[0].markLine.data[0].yAxis = price.value // add horizontal line with current price
      chartData.value.series[0].markPoint.data[0].yAxis = price.value// add  point to end line
      chartData.value.title.subtext = formatNumber(Number(price.value)) // show price sub pair/name
      chartData.value.title.text = selectedValue.value.toUpperCase()+'/USDT' // show  pair/name
    }

    const newDot = computed(() => ({//create a new DOt
      yAxis: clickPosition.value.y,
      xAxis: clickPosition.value.x,
      animation: true,
      // symbol: 'circle',
      symbolSize: 40,
      itemStyle: {
        color: 'yellow'
      },
      label: {
        show: true,
        formatter: function (params) {
          return `${winnerBet.value[params.dataIndex - 1]}` // get a bet$ for every dot
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
        position: "end",
        formatter: (params) => {
          return `${formatNumber(Number(params.data.value))}`;
        },
      }
    }))

    const getPos = () => {
      clickPosition.value = {
        x: chartData.value.series[0].markPoint.data[0].xAxis = dateConvert(),
        y: chartData.value.series[0].markPoint.data[0].yAxis = price.value
      }
    }

    const positiveNewDot = () => {
      if (moneyBet.value >= balance.value || moneyBet.value == 0 || moneyBet.value.length > 5) {
        alert('error')
        return false
      }
      getPos(); //get yAxis, xAxis
      winnerBet.value.push(moneyBet.value)
      dotsArray.value.push(newDot.value) //create dot
      linesArray.value.push(newLine.value) // create line for dot
      timer(true)
    }

    const negativeNewDot = () => {
      if (moneyBet.value >= balance.value || moneyBet.value == 0 || moneyBet.value.length > 6) {
        alert('error')
        return false
      }
      getPos();
      dotsArray.value.push(newDot.value) //create dot
      linesArray.value.push(newLine.value) // create line for dot
      winnerBet.value.push(moneyBet.value)
      timer(false)
    }

    const timer = (bool) => {
      if (!click.value) {
        click.value = true
        const interval = setInterval(() => {
          if (time.value >= timeBet.value) {
            time.value = 0
            click.value = false
            calcAllDots(bool)
            dotsArray.value.splice(1, chartData.value.series[0].markPoint.data.length) //remove dots excluding main dots
            linesArray.value.splice(1, chartData.value.series[0].markLine.data.length)//remove lines excluding main line
            return clearInterval(interval)
          }
          time.value++
        }, 1000)
      }
    }

    const calcAllDots = (bool) => {
      const positionFirstDot = chartData.value.series[0].markPoint.data[0].yAxis
      winnerBetDots.value = bool ? dotsArray.value.slice(1, dotsArray.value.length).map((item, index) => {
        if (positionFirstDot > item.yAxis) {
          balance.value += +profitFormulaCurrency(winnerBet.value[index])
          return item
        } else {
          balance.value -= +profitFormulaCurrency(winnerBet.value[index])
        }
      }) : dotsArray.value.slice(1, dotsArray.value.length).map((item, index) => {
        if (positionFirstDot < item.yAxis) {
          balance.value += +profitFormulaCurrency(winnerBet.value[index])
          return item
        } else {
          balance.value -= +profitFormulaCurrency(winnerBet.value[index])
        }
      })
      winnerBet.value = []
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

    const plusMoneyBet = () => {
      if (moneyBet.value.length > 6) {
        alert('error')
      } else {
        moneyBet.value++
      }
    }

    const minusMoneyBet = () => {
      if (moneyBet.value <= 1 || moneyBet.value.length > 6) {
        alert('bet cant be lower than zero')
      } else {
        moneyBet.value--
      }
    }

    const plusTimeBet = () => {
      if (moneyBet.value.length > 6) {
        alert('error plus')
      } else {
        timeBet.value++
      }
    }

    const minusTimeBet = () => {
      if (timeBet.value <= 1) {
        alert('time cant be lower than zero')
      } else {
        timeBet.value--
      }
    }

    const clearDataForNewGraphic = ()=>{
      winnerBetDots.value = []
      winnerBet.value = []
      moneyBet.value = 1
      timeBet.value = 30
      dataPoints.value = []
      labels.value = []
    }

    const fetchStarterGraphic = async (times = 120,interval='1s', symbol= selectedValue.value)=>{
      const correctedSymbol = symbol.toUpperCase() + 'USDT'
      loading.value = true
      const {data} = await axios.get('https://api.binance.com/api/v1/klines', {
        params: {
          limit: times, // length of data
          interval: interval,
          symbol: correctedSymbol
        }
      })
      loading.value = false // true when axios return response
      data.forEach(([xAxis, yAxis]) => {
        dataPoints.value.push(yAxis);
        labels.value.push(dayjs(xAxis).format('HH:mm:ss'))
      })
    }

    onMounted(async () => {
      await fetchStarterGraphic()
    })

    watch(selectedValue, ()=>{
      ws.onclose = function(){}
      ws.close()
      clearDataForNewGraphic()
      fetchStarterGraphic(120,'1s',selectedValue.value)
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${selectedValue.value}usdt@kline_1s`)
      ws.onmessage = (event) => {
        data.value = JSON.parse(event.data)
        grabData(data.value)
        generateLabels()
        calculateMinAxis()
      }
    })

    return {
      loading,
      price,
      chartData,
      moneyBet,
      timeBet,
      plusMoneyBet,
      minusMoneyBet,
      plusTimeBet,
      minusTimeBet,
      profitFormulaCurrency,
      balance,
      selectedValue,
      allSelectOptions,
      getPos,
      positiveNewDot,
      time,
      negativeNewDot
    }
  }
}
</script>
<style lang="scss" scoped>

.button {
  cursor: pointer;
  padding: 20px 30px;
  border: none;
  border-radius: 2px;
  font-size: 18px;
  color: white;
  margin-bottom: 10px;
  width: 100%;

  &__hight {
    background: #35A947;
  }

  &__lower {
    background: #E34828;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
