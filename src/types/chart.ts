export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar';

export type BarVariant     = 'grouped' | 'stacked' | 'stacked100' | 'horizontal';
export type LineVariant    = 'smooth' | 'linear' | 'step';
export type AreaVariant    = 'overlapping' | 'stacked' | 'stacked100' | 'step';
export type PieVariant     = 'pie' | 'donut' | 'half';
export type ScatterVariant = 'points' | 'bubble';
export type RadarVariant   = 'filled' | 'outline' | 'dot';

export interface ChartVariants {
  bar:     BarVariant;
  line:    LineVariant;
  area:    AreaVariant;
  pie:     PieVariant;
  scatter: ScatterVariant;
  radar:   RadarVariant;
}

export interface AxisColors {
  xAxis: string;
  yAxis: string;
  grid: string;
}

export interface AxisLabels {
  xAxis: string;
  yAxis: string;
}

// font size (px) of the axis title labels
export interface AxisLabelFontSizes {
  xAxis: number;
  yAxis: number;
}

// fill color of the axis title labels (independent of the axis line/tick color)
export interface AxisLabelColors {
  xAxis: string;
  yAxis: string;
}

// font size (px) of the axis tick values
export interface AxisTickFontSizes {
  xAxis: number;
  yAxis: number;
}

// fill color of the axis tick values (independent of the axis line color)
export interface AxisTickColors {
  xAxis: string;
  yAxis: string;
}

export interface DataRow {
  [key: string]: string | number;
}

export interface ColumnDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'color';
  isSeries?: boolean;
  color?: string;
}

export interface ChartConfig {
  type: ChartType;
  label: string;
  description: string;
  columns: ColumnDef[];
  seriesKeys: string[];
  categoryKey: string;
  defaultData: DataRow[];
}

export interface SavedChartConfig {
  type: ChartType;
  columns: ColumnDef[];
  variants: ChartVariants;
  data: DataRow[];
  elementId?: string;
  axisColors?: AxisColors;
  axisLabels?: AxisLabels;
  axisLabelFontSizes?: AxisLabelFontSizes;
  axisLabelColors?: AxisLabelColors;
  axisTickFontSizes?: AxisTickFontSizes;
  axisTickColors?: AxisTickColors;
}
