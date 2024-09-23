"use client";
import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/charts";
import fetchExchangeRates from "@/utils/fetchHistoryRate";

interface LineChartProps {
  maxWidth?: number;
  selectedModalCurrency: string;
  basedCurrency?: string;
  currentRate: number;
}

function getFormattedPastDates(day: number) {
  const now = new Date();
  const date = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return formatDate(date);
}

const LineChart: React.FC<LineChartProps> = ({
  basedCurrency,
  maxWidth,
  selectedModalCurrency,
  currentRate,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Array<{ date: string; rate: number }>>([]);
  const twoWeeksAgoTimestamp = getFormattedPastDates(14);
  const oneWeekAgoTimestamp = getFormattedPastDates(7);

  useEffect(() => {
    setIsLoading(true);
    const fetchRates = async () => {
      try {
        const [twoWeeksData, oneWeekData] = await Promise.all([
          fetchExchangeRates(basedCurrency, twoWeeksAgoTimestamp),
          fetchExchangeRates(basedCurrency, oneWeekAgoTimestamp)
        ]);

        if (!twoWeeksData || !oneWeekData) {
          throw new Error("Failed to fetch exchange rates");
        }

        const newData = [
          {
            date: twoWeeksAgoTimestamp,
            rate: twoWeeksData[selectedModalCurrency],
          },
          {
            date: oneWeekAgoTimestamp,
            rate: oneWeekData[selectedModalCurrency],
          },
          {
            date: getFormattedPastDates(0), // Today's date
            rate: currentRate,
          },
        ].filter(item => item.rate !== undefined);

        setData(newData);

      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
        setData([]); // Set empty array in case of error
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [basedCurrency, selectedModalCurrency, currentRate]);

  const config = {
    data,
    xField: "date",
    yField: "rate",
    width: maxWidth,
    autoFit: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: 'Rate', value: datum.rate.toFixed(4) };
      },
    },
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex space-x-4" key={selectedModalCurrency}>
        <div className="h-5 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ maxWidth: maxWidth || "100%" }} key={selectedModalCurrency}>
      <Line {...config} />
    </div>
  );
};

export default LineChart;