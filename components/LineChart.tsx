import React from "react";
import { Line } from "@ant-design/charts";

interface LineChartProps {
  data: any[];
  maxWidth?: number;
  selectedModalCurrency: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  maxWidth,
  selectedModalCurrency,
}) => {
  const config = {
    data,
    title: {
      visible: true,
      text: "historical",
    },
    xField: "date",
    yField: "rate",
    width: maxWidth,
    autoFit: true,
  };

  console.log("maxWidth", maxWidth);
  return (
    <div style={{ maxWidth: maxWidth || "100%" }} key={selectedModalCurrency}>
      <Line {...config} />
    </div>
  );
};

export default LineChart;
