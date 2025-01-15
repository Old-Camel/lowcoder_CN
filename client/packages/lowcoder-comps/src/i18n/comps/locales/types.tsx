import { JSONObject } from "lowcoder-sdk";
import { XAXisComponentOption } from "echarts";

export type I18nObjects = {
  defaultDataSource: JSONObject[];
  defaultEchartsJsonOption: Record<string, unknown>;
  timeXAxisLabel?: XAXisComponentOption["axisLabel"];
  defaultGaugeChartOption: Record<string, unknown>;
  defaultFunnelChartOption: Record<string, unknown>;
  defaultSankeyChartOption: Record<string, unknown>;
  defaultCandleStickChartOption: Record<string, unknown>;
  defaultRadarChartOption: Record<string, unknown>;
  defaultHeatmapChartOption: Record<string, unknown>;
  defaultGraphChartOption: Record<string, unknown>;
  defaultTreeChartOption: Record<string, unknown>;
  defaultTreemapChartOption: Record<string, unknown>;
  defaultSunburstChartOption: Record<string, unknown>;
  defaultCalendarChartOption: Record<string, unknown>;
  defaultThemeriverChartOption: Record<string, unknown>;
  imageEditorLocale?: Record<string, string>;
};
