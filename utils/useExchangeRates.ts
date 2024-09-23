"use client"
import { useState, useEffect } from 'react';
import fetchExchangeRate from "@/utils/fetchExchangeRate";
import { ExchangeRateResponse } from "@/app/lib/definitions";
import fetchExchangeRates from "@/utils/fetchHistoryRate";

function get14DaysAgoTimestamp() {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    return Math.floor(fourteenDaysAgo.getTime() / 1000);
  }

// custom hook
const useExchangeRates = (selectedCurrency: string, isFetchingHistory: boolean) => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateResponse["rates"]>({ USD: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const twoWeeksAgoTimestamp = get14DaysAgoTimestamp();

  useEffect(() => {
    setIsLoading(true);
    const fetchRates = async () => {
      try {
        const data = !isFetchingHistory ? await fetchExchangeRate(selectedCurrency) : await fetchExchangeRates(selectedCurrency, twoWeeksAgoTimestamp);

        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  return { exchangeRates, isLoading };
};

export default useExchangeRates;