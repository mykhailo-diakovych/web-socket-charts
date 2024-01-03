import { CHART_TYPE } from "@/constants/chart";

export interface ChartType {
  LINE: "line";
  CANDLESTICK: "candlestick";
}

export type ChartTypeValue = typeof CHART_TYPE[keyof typeof CHART_TYPE];

export interface ClickPosition {
  x: number | string | number[];
  y: number | string | number[];
}

export interface WebSocketDataEntity {
  e: string;
  E: number;
  s: string;
  k: WebSocketDataK;
}

export interface WebSocketDataK {
  t: number;
  T: number;
  s: string;
  i: string;
  f: number;
  L: number;
  o: number;
  c: number;
  h: number;
  l: number;
  v: string;
  n: number;
  x: boolean;
  q: string;
  V: string;
  Q: string;
  B: string;
}

export interface LabelFormatterEntity {
  componentType: string;
  componentSubType: string;
  componentIndex: number;
  seriesType: any;
  seriesIndex: number;
  seriesId: any;
  seriesName: any;
  name: string;
  dataIndex: number;
  data: Data;
  dataType: any;
  color: string;
  dimensionNames: any[];
  encode: Encode;
  $vars: string[];
  status: string;
}

export interface Data {
  yAxis: string;
  xAxis: string;
  animation: boolean;
  symbolSize: number;
  itemStyle: ItemStyle;
  label: Label;
  coord: string[];
  value: number;
}

export interface ItemStyle {
  color: string;
}

export interface Label {
  show: boolean;
}

export interface Encode {
  x: number[];
  y: number[];
}
