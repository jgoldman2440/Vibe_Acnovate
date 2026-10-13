import ChartTypeSelector from "../components/ChartTypeSelector";
import ChartDataEditor from "../components/ChartDataEditor";
import ChartPreview from "../components/ChartPreview";
import type {
  AxisColors,
  AxisLabelColors,
  AxisLabelFontSizes,
  AxisLabels,
  AxisTickColors,
  AxisTickFontSizes,
  ChartType,
  ChartVariants,
  ColumnDef,
  DataRow,
  PolarAxisColors,
  PolarAxisFontSizes,
  SavedChartConfig,
} from "../types/chart";
import {
  chartConfigs,
  defaultAxisColors,
  defaultAxisLabelColors,
  defaultAxisLabelFontSizes,
  defaultAxisLabels,
  defaultAxisTickColors,
  defaultAxisTickFontSizes,
  defaultVariants,
  DEFAULT_LEGEND_FONT_SIZE,
  DEFAULT_PIE_LABEL_FONT_SIZE,
  defaultPolarAxisColors,
  defaultPolarAxisFontSizes,
  variantOptions,
} from "../data/chartConfigs";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppExtension, getAppContext } from "@contrail/extensions-sdk";
import { ShowcaseChartContentService } from "../utils/showcaseChartUtil";

type Step = "select" | "edit";

export default function GeneratePage() {
  const location = useLocation();
  const existingChartConfig = location.state?.chartConfig as
    | SavedChartConfig
    | undefined;

  const [step, setStep] = useState<Step>(
    existingChartConfig ? "edit" : "select",
  );
  const [selectedType, setSelectedType] = useState<ChartType | null>(
    existingChartConfig?.type ?? null,
  );
  const [chartData, setChartData] = useState<DataRow[]>(
    existingChartConfig?.data ?? [],
  );
  const [chartColumns, setChartColumns] = useState<ColumnDef[]>(
    existingChartConfig?.columns ?? [],
  );
  const [variants, setVariants] = useState<ChartVariants>(
    existingChartConfig
      ? { ...defaultVariants, ...existingChartConfig.variants }
      : defaultVariants,
  );
  const [axisColors, setAxisColors] = useState<AxisColors>(
    existingChartConfig
      ? { ...defaultAxisColors, ...existingChartConfig.axisColors }
      : defaultAxisColors,
  );
  const [axisLabels, setAxisLabels] = useState<AxisLabels>(
    existingChartConfig
      ? { ...defaultAxisLabels, ...existingChartConfig.axisLabels }
      : defaultAxisLabels,
  );
  const [axisLabelFontSizes, setAxisLabelFontSizes] = useState<AxisLabelFontSizes>(
    existingChartConfig
      ? { ...defaultAxisLabelFontSizes, ...existingChartConfig.axisLabelFontSizes }
      : defaultAxisLabelFontSizes,
  );
  // charts saved before label colors existed used the axis color for their labels
  const [axisLabelColors, setAxisLabelColors] = useState<AxisLabelColors>(
    existingChartConfig
      ? {
          xAxis: existingChartConfig.axisColors?.xAxis ?? defaultAxisLabelColors.xAxis,
          yAxis: existingChartConfig.axisColors?.yAxis ?? defaultAxisLabelColors.yAxis,
          ...existingChartConfig.axisLabelColors,
        }
      : defaultAxisLabelColors,
  );
  const [axisTickFontSizes, setAxisTickFontSizes] = useState<AxisTickFontSizes>(
    existingChartConfig
      ? { ...defaultAxisTickFontSizes, ...existingChartConfig.axisTickFontSizes }
      : defaultAxisTickFontSizes,
  );
  // charts saved before tick colors existed used the axis color for their ticks
  const [axisTickColors, setAxisTickColors] = useState<AxisTickColors>(
    existingChartConfig
      ? {
          xAxis: existingChartConfig.axisColors?.xAxis ?? defaultAxisTickColors.xAxis,
          yAxis: existingChartConfig.axisColors?.yAxis ?? defaultAxisTickColors.yAxis,
          ...existingChartConfig.axisTickColors,
        }
      : defaultAxisTickColors,
  );
  const [legendFontSize, setLegendFontSize] = useState<number>(
    existingChartConfig?.legendFontSize ?? DEFAULT_LEGEND_FONT_SIZE,
  );
  const [pieLabelFontSize, setPieLabelFontSize] = useState<number>(
    existingChartConfig?.pieLabelFontSize ?? DEFAULT_PIE_LABEL_FONT_SIZE,
  );
  const [polarAxisFontSizes, setPolarAxisFontSizes] = useState<PolarAxisFontSizes>(
    existingChartConfig
      ? { ...defaultPolarAxisFontSizes, ...existingChartConfig.polarAxisFontSizes }
      : defaultPolarAxisFontSizes,
  );
  const [polarAxisColors, setPolarAxisColors] = useState<PolarAxisColors>(
    existingChartConfig
      ? { ...defaultPolarAxisColors, ...existingChartConfig.polarAxisColors }
      : defaultPolarAxisColors,
  );
  const [isExporting, setIsExporting] = useState(false);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const ctx = getAppContext();
  const showcaseId = ctx?.appContext?.showcase?.id;
  const contentHolderReference = `showcase:${showcaseId}`;

  const handleAddOrUpdate = async () => {
    if (!chartContainerRef.current || !showcaseId || !selectedType) return;
    setIsExporting(true);
    try {
      await ShowcaseChartContentService.addOrUpdateChartInShowcase({
        contentHolderReference,
        chartContainer: chartContainerRef.current,
        chartConfig: {
          type: selectedType,
          columns: chartColumns,
          variants,
          data: chartData,
          elementId: existingChartConfig?.elementId,
          axisColors,
          axisLabels,
          axisLabelFontSizes,
          axisLabelColors,
          axisTickFontSizes,
          axisTickColors,
          legendFontSize,
          pieLabelFontSize,
          polarAxisFontSizes,
          polarAxisColors,
        },
      });
    } finally {
      setIsExporting(false);
      AppExtension.close();
    }
  };

  const handleSelectType = (type: ChartType) => {
    setSelectedType(type);
    setChartData(chartConfigs[type].defaultData);
    setChartColumns([...chartConfigs[type].columns]);
    setVariants(defaultVariants);
    setAxisColors(defaultAxisColors);
    setAxisLabels(defaultAxisLabels);
    setAxisLabelFontSizes(defaultAxisLabelFontSizes);
    setAxisLabelColors(defaultAxisLabelColors);
    setAxisTickFontSizes(defaultAxisTickFontSizes);
    setAxisTickColors(defaultAxisTickColors);
    setLegendFontSize(DEFAULT_LEGEND_FONT_SIZE);
    setPieLabelFontSize(DEFAULT_PIE_LABEL_FONT_SIZE);
    setPolarAxisFontSizes(defaultPolarAxisFontSizes);
    setPolarAxisColors(defaultPolarAxisColors);
    setStep("edit");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedType(null);
  };

  const handleVariantChange = (value: string) => {
    if (!selectedType) return;
    setVariants(
      (prev) => ({ ...prev, [selectedType]: value }) as ChartVariants,
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {step === "select" && <ChartTypeSelector onSelect={handleSelectType} />}

      {step === "edit" && selectedType && (
        <>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
            {!existingChartConfig && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            )}
            {!existingChartConfig && (<div className="w-px h-5 bg-gray-200" />)}
            <h1 className="text-sm font-semibold text-gray-900">
              {chartConfigs[selectedType].label}
            </h1>

            <button
              onClick={handleAddOrUpdate}
              disabled={isExporting || !showcaseId}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isExporting ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364-6.364-2.121 2.121M8.757 15.243l-2.121 2.121m0-12.728 2.121 2.121m6.486 6.486 2.121 2.121"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
              {existingChartConfig ? "Update" : "Add"}
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-5/12 border-r border-gray-200 overflow-hidden flex flex-col">
              <div className="px-4 pt-4 pb-2 shrink-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Chart Data
                </p>
              </div>

              <div className="px-4 pb-3 shrink-0 border-b border-gray-100">
                <div className="flex gap-1 flex-wrap">
                  {variantOptions[selectedType].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleVariantChange(opt.value)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                        variants[selectedType] === opt.value
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <ChartDataEditor
                chartType={selectedType}
                data={chartData}
                columns={chartColumns}
                onChange={setChartData}
                onColumnsChange={setChartColumns}
                axisColors={axisColors}
                onAxisColorsChange={setAxisColors}
                axisLabels={axisLabels}
                onAxisLabelsChange={setAxisLabels}
                axisLabelFontSizes={axisLabelFontSizes}
                onAxisLabelFontSizesChange={setAxisLabelFontSizes}
                axisLabelColors={axisLabelColors}
                onAxisLabelColorsChange={setAxisLabelColors}
                axisTickFontSizes={axisTickFontSizes}
                onAxisTickFontSizesChange={setAxisTickFontSizes}
                axisTickColors={axisTickColors}
                onAxisTickColorsChange={setAxisTickColors}
                legendFontSize={legendFontSize}
                onLegendFontSizeChange={setLegendFontSize}
                pieLabelFontSize={pieLabelFontSize}
                onPieLabelFontSizeChange={setPieLabelFontSize}
                polarAxisFontSizes={polarAxisFontSizes}
                onPolarAxisFontSizesChange={setPolarAxisFontSizes}
                polarAxisColors={polarAxisColors}
                onPolarAxisColorsChange={setPolarAxisColors}
              />
            </div>

            <div className="w-7/12 overflow-hidden">
              <ChartPreview
                chartType={selectedType}
                data={chartData}
                columns={chartColumns}
                variants={variants}
                axisColors={axisColors}
                axisLabels={axisLabels}
                axisLabelFontSizes={axisLabelFontSizes}
                axisLabelColors={axisLabelColors}
                axisTickFontSizes={axisTickFontSizes}
                axisTickColors={axisTickColors}
                legendFontSize={legendFontSize}
                pieLabelFontSize={pieLabelFontSize}
                polarAxisFontSizes={polarAxisFontSizes}
                polarAxisColors={polarAxisColors}
                containerRef={chartContainerRef}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
