import {
  ClickPosition,
  LabelFormatterEntity,
} from "@/types/crypto-chart-types";
import { Ref } from "vue";
import { formatNumber } from "@/utils/format-float";

const getSameDotOptions = (labelValue: Ref<any>, colorMarker: Ref<string>) => {
  return {
    animation: true,
    symbolSize: 40,
    itemStyle: {
      color: colorMarker.value,
    },
    label: {
      show: true,
      formatter: function (params: LabelFormatterEntity) {
        return `${labelValue.value[params.dataIndex - 1] || 0}`; // get a bet$ for every dot
      },
    },
  };
};

export const generateNewDotOptions = (
  clickPosition: Ref<ClickPosition>,
  labelValue: Ref<any>,
  colorMarker: Ref<string>
) => ({
  //create a new Dot
  yAxis: clickPosition.value.y,
  xAxis: clickPosition.value.x,
  ...getSameDotOptions(labelValue, colorMarker),
});

export const generateNewCandleDotOptions = (
  clickPosition: Ref<ClickPosition>,
  labelValue: Ref<any>,
  colorMarker: Ref<string>
) => ({
  //create a new Dot
  coord: [clickPosition.value.x, clickPosition.value.y],
  ...getSameDotOptions(labelValue, colorMarker),
});

export const generateNewLineOptions = (clickPosition: Ref<ClickPosition>) => ({
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
});
