"use client";
import React, { useState, useEffect } from "react";
import CurrencyRow from "@/components/CurrencyConverter";
import fetchExchangeRate from "@/utils/fetchExchangeRate";
import { ExchangeRateResponse } from "@/app/lib/definitions";

const currencies = [
  { code: "AUD", name: "Australian Dollar"},
  { code: "CAD", name: "Canadian Dollar"},
  { code: "JPY", name: "Japan"},
  { code: "GBP", name: "British Pound"},
  { code: "NZD", name: "New Zealand Dollar"},
  { code: "USD", name: "US Dollar"},
];

const safelyGetExchangeRate = (
  exchangeRates: { [key: string]: number } | undefined,
  currencyCode: string
): number => {
  if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
    return 1; // Default to 1 if exchangeRates is undefined or empty
  }

  const rate = exchangeRates[currencyCode];
  return typeof rate === "number" && !isNaN(rate) ? rate : 1;
};

const CurrencyConverter = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[5]);
  const [amount, setAmount] = useState(1000);
  const [exchangeRates, setExchangeRates] = useState<
    ExchangeRateResponse["rates"] | {}
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchRates = async () => {
      try {
        const data = await fetchExchangeRate(selectedCurrency.code);
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [selectedCurrency.code]);
  console.log("exchangeRates", exchangeRates);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-scroll">
      <div className="p-1 bg-blue-50">
        <h2 className="text-lg font-semibold text-center">Convert</h2>
      </div>

      <CurrencyRow
        key={selectedCurrency.code}
        currency={selectedCurrency.code}
        amount={amount}
        // symbol={selectedCurrency.flag}
        defaultRow={true}
      />
      {currencies
        .filter((currency) => currency.code !== selectedCurrency.code)
        .map((currency) => (
            <CurrencyRow
              key={currency.code}
              currency={currency.code}
              amount={
                isLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-5 w-20 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  amount * safelyGetExchangeRate(exchangeRates, currency.code)
                )
              }
              defaultRow={false}
            />
        ))}
    </div>
  );
};

export default CurrencyConverter;
