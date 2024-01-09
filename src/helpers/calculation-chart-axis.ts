import { Ref } from "vue";

export const calculateMinAxis = (chartData: Ref<any>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chartData.value.yAxis.min = Math.min(...chartData.value.series[0].data);
  return chartData.value.yAxis.min;
};
