import { graphicColors } from "@/core-data/ui/graphic-colors";
import * as echarts from "echarts";
import { formatNumber } from "@/utils/format-float";

export default (typeChart: any) => {
  return {
    title: {
      text: "BTC/USDT",
      subtext: "",
      left: "center",
      padding: [0, 0, 0, 90],
      subtextStyle: {
        color: "#BABAD2",

        fontSize: 16,
      },
      textStyle: {
        color: "#fff",
      },
    },
    symbol: "none",
    grid: {
      left: "10%",
    },
    dataZoom: [
      //add zoom
      {
        type: "inside",
        start: 0,
      },
    ],
    tooltip: {
      axisPointer: {
        type: "cross",
        crossStyle: {
          type: "solid",
        },
        label: {
          backgroundColor: "#6a7985",
        },
      },
      extraCssText: "text-transform: uppercase",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        //add axisX text color
        color: "white",
      },
      data: [],
      splitLine: {
        show: true,
        lineStyle: {
          color: graphicColors.VERTICAL_LINES,
        },
      },
    },
    yAxis: {
      type: "value",
      min: null,
      axisLabel: {
        //add axisY text color
        color: "white",
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: graphicColors.HORIZONTAL_LINES,
        },
      },
    },
    series: [
      {
        type: typeChart,
        showSymbol: false,
        symbol: "none",
        data: [],
        markPoint: {
          // add point to line
          data: [
            {
              yAxis: 0,
              xAxis: 0,
              animation: true,
              symbol: "circle",
              symbolSize: 6,
              itemStyle: {
                color: "#7ABD63",
              },
            },
          ],
        },
        lineStyle: {
          color: graphicColors.GRAPHIC_LINE,
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
              color: graphicColors.GRAPHIC_SHADOW[1],
            },
          ]),
        },
        markLine: {
          symbolRotate: 90,
          symbolSize: [28, 20],
          symbol: ["none", "none"],
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
                formatter: (params: any) => {
                  if (!params.data.value) return "";
                  return `${formatNumber(Number(params.data.value))}`;
                },
                fontSize: 12,
              },
              lineStyle: {
                type: "solid",
                width: 1,
                color: "#B09EFF",
              },
            },
            //end first
            // second
            {
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "gray",
              },
              label: {
                opacity: 0.3,
                position: "end",
                formatter: (params: any) => {
                  return `AVG: ${formatNumber(params.data.value)}`;
                },
                color: "white",
              },
              type: "average",
              tooltip: {
                show: false,
              },
            },
            //end second
            // third
            {
              label: {
                opacity: 0.3,
                position: "end",
                formatter: (params: any) => {
                  return `MAX: ${formatNumber(Number(params.data.value))}`;
                },
                color: "white",
              },
              type: "max",
              tooltip: {
                show: false,
              },
              lineStyle: {
                type: "dashed",
                width: 1,
                color: "gray",
              },
            },
          ],
        },
      },
    ],
  };
};
