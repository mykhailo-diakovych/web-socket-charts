export type DotsArray = NewDotLine[];

export interface NewDotLine {
  yAxis: string | number | number[];
  xAxis: string | number | number[];
  animation: boolean;
  symbolSize: number;
  itemStyle: NewDotLineItemStyle;
  label?: NewDotLineLabel;
  symbol?: string;
}

export interface NewDotLineItemStyle {
  color: string;
}

export interface NewDotLineLabel {
  show: boolean;
}

export interface NewDotCandlestick {
  coord: (string | number | number[])[];
  animation: boolean;
  symbolSize: number;
  itemStyle: NewDotCandlestickItemStyle;
  label?: NewDotCandlestickLabel;
  symbol?: string;
}

export interface NewDotCandlestickItemStyle {
  color: string;
}

export interface NewDotCandlestickLabel {
  show: boolean;
}
