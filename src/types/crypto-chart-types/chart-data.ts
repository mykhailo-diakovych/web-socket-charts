import { LabelFormatterEntity } from "@/types/crypto-chart-types/index";

export interface ChartData {
  title: Title;
  symbol: string;
  grid: Grid;
  dataZoom: DataZoom[];
  tooltip: Tooltip;
  xAxis: XAxis;
  yAxis: YAxis;
  series: Series[];
}

export interface Title {
  text: string;
  subtext: string;
  left: string;
  padding: number[];
  subtextStyle: SubtextStyle;
  textStyle: TextStyle;
}

export interface SubtextStyle {
  color: string;
  fontSize: number;
}

export interface TextStyle {
  color: string;
}

export interface Grid {
  left: string;
}

export interface DataZoom {
  type: string;
  start: number;
}

export interface Tooltip {
  axisPointer: AxisPointer;
  extraCssText: string;
}

export interface AxisPointer {
  type: string;
  crossStyle: CrossStyle;
  label: Label;
}

export interface CrossStyle {
  type: string;
}

export interface Label {
  backgroundColor: string;
}

export interface XAxis {
  type: string;
  boundaryGap: boolean;
  axisLabel: XAxisLabel;
  data: string[];
  splitLine: XAxisSplitLine;
}

export interface XAxisLabel {
  color: string;
}

export interface XAxisSplitLine {
  show: boolean;
  lineStyle: XAxisLineStyle;
}

export interface XAxisLineStyle {
  color: string;
}

export interface YAxis {
  type: string;
  min: number | null;
  axisLabel: YAxisLabel;
  splitLine: YAxisSplitLine;
}

export interface YAxisLabel {
  color: string;
}

export interface YAxisSplitLine {
  show: boolean;
  lineStyle: YAxisLineStyle;
}

export interface YAxisLineStyle {
  color: string;
}

export interface Series {
  type: string;
  showSymbol: boolean;
  symbol: string;
  data: number[] | string[] | string[][] | number[][];
  markPoint: MarkPoint;
  lineStyle: SeriesLineStyle;
  areaStyle: AreaStyle;
  markLine: MarkLine;
}

export interface MarkPoint {
  data: MarkPointData[];
}

export interface MarkPointData {
  yAxis: string | number | number[];
  xAxis: string | number | number[];
  animation: boolean;
  symbol: string;
  symbolSize: number;
  itemStyle: ItemStyle;
}

export interface ItemStyle {
  color: string;
}

export interface SeriesLineStyle {
  color: string;
}

export interface AreaStyle {
  opacity: number;
  color: Color;
}

export interface Color {
  colorStops: ColorStop[];
  x: number;
  y: number;
  x2: number;
  y2: number;
  type: string;
  global: boolean;
}

export interface ColorStop {
  offset: number;
  color: string;
}

export interface MarkLine {
  symbolRotate: number;
  symbolSize: number[];
  symbol: string[];
  data: MarkLineData[];
}

export interface MarkLineData {
  yAxis?: string | number | number[];
  tooltip: MarkLineDataTooltip;
  label: MarkLineDataLabel;
  lineStyle: MarkLineDataLineStyle;
  type?: string;
}

export interface MarkLineDataTooltip {
  show: boolean;
}

export interface MarkLineDataLabel {
  opacity: number;
  show?: boolean;
  distance?: number;
  color: string;
  backgroundColor?: string;
  position: string;
  padding?: number[];
  formatter?: (params: LabelFormatterEntity) => string;
  fontSize?: number;
}

export interface MarkLineDataLineStyle {
  type: string;
  width: number;
  color: string;
}
