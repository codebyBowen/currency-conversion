"use client";
import React, { useState, useEffect } from "react";
import CurrencyRow from "@/components/CurrencyConverter";
import fetchExchangeRate from "@/utils/fetchExchangeRate";
import { ExchangeRateResponse } from "@/app/lib/definitions";
import LineChart from "@/components/LineChart";
import { Modal } from "antd";
import data from "@/utils/mock-historical-rates.json";

export const currencies = [
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "JPY", name: "Japan" },
  { code: "GBP", name: "British Pound" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "USD", name: "US Dollar" },
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
  const [selectedCurrency, setSelectedCurrency] = useState<
    "AUD" | "USD" | "JPY" | "NZD" | "GBP" | "CAD"
  >("AUD");
  const [amount, setAmount] = useState(1000);
  const [exchangeRates, setExchangeRates] = useState<
    ExchangeRateResponse["rates"]
  >({ USD: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalCurrency, setSelectedModalCurrency] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchRates = async () => {
      try {
        const data = await fetchExchangeRate(selectedCurrency);
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRates();
  }, [selectedCurrency]);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  const handleBaseCurrencyChange = (
    newCurrency: "AUD" | "USD" | "JPY" | "NZD" | "GBP" | "CAD"
  ) => {
    setSelectedCurrency(newCurrency);
  };

  const openModal = (currencyCode: string) => {
    setSelectedModalCurrency(currencyCode);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white ">
      <div className="w-full h-10 mx-auto mb-10 shadow-md flex items-center justify-center">
        <h2 className="text-xl font-semibold">Convert</h2>
      </div>
      <div className="flex-grow overflow-auto p-5">
        <div className="mb-20">
          <CurrencyRow
            key={selectedCurrency}
            currency={selectedCurrency}
            amount={amount}
            onAmountChange={handleAmountChange}
            onBaseCurrencyChange={handleBaseCurrencyChange}
            defaultRow={true}
            onCurrencyClick={() => openModal(selectedCurrency)}
          />
        </div>

        {currencies
          .filter((currency) => currency.code !== selectedCurrency)
          .map((currency) => (
            <CurrencyRow
              key={currency.code}
              currency={currency.code}
              rates={exchangeRates && exchangeRates[currency.code]}
              onCurrencyClick={() => openModal(currency.code)}
              amount={
                isLoading ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-5 w-20 bg-gray-300 rounded"></div>
                  </div>
                ) : (
                  amount * safelyGetExchangeRate(exchangeRates, currency.code)
                )
              }
              selectedCurrency={selectedCurrency}
              defaultRow={false}
            />
          ))}
      </div>
      <Modal
        title={`${selectedCurrency} to ${selectedModalCurrency} Historical Rates`}
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        <LineChart
          data={data[selectedModalCurrency]}
          maxWidth={400}
          selectedModalCurrency={selectedModalCurrency}
        />
      </Modal>
    </div>
  );
};

export default CurrencyConverter;
