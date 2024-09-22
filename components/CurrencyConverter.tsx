import React, { useState, useEffect } from "react";
import { CurrenyAmountProps } from "@/app/lib/definitions";
import data from "@/utils/Common-Currency.json";

const formatNumber = (
  num: number,
  minimumFractionDigits: number = 2
): string => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  });
};

const CurrencyRow = (props: CurrenyAmountProps) => {
  const {
    currency,
    amount,
    defaultRow,
    selectedCurrency,
    rates,
    onAmountChange,
  } = props;
  const [inputAmount, setInputAmount] = useState<number>(
    typeof amount === "number" ? amount : 0
  );

  useEffect(() => {
    if (typeof amount === "number") {
      setInputAmount(amount);
    }
  }, [amount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setInputAmount(parsedValue);
    }
  };

  // console.log('formatNumber(inputAmount)', formatNumber(inputAmount))
  return (
    <div className="flex items-center justify-between p-4 rounded-lg max-w-md mx-auto border-solid border-2 border-slate-300 mb-3">
      <div className="flex items-center w-1/4">
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${currency
            .substring(0, 2)
            .toLowerCase()}.svg`}
          width="25"
          alt={`${currency} flag`}
        />
        <div className="flex items-end justify-end w-1/2">
          <span className="font-semibold">{currency}</span>
          {defaultRow && (
            <span className="text-gray-400">
              <svg
                className="w-4 h-4 inline-block"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end w-1/2">
        {defaultRow ? (
          <>
            <>{`${data[currency].symbol_native}`}</>
            <input
              type="text"
              value={formatNumber(inputAmount, 0)}
              onChange={handleInputChange}
              className="w-24 text-right font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </>
        ) : typeof amount === "number" ? (
          <div className="text-right">
            <p className="w-auto text-right font-semibold">{`${
              data[currency].symbol_native
            } ${formatNumber(amount)}`}</p>
            {
              <p className="text-xs text-gray-500">{`1 ${selectedCurrency} = ${rates.toFixed(
                4
              )} ${currency}`}</p>
            }
          </div>
        ) : (
          amount // This will render the loading animation when amount is a ReactNode
        )}
      </div>
      <div className="flex items-center">
        {" "}
        {defaultRow && (
          <div onClick={() => onAmountChange(inputAmount)}>
            <span className="text-gray-400">
              <svg
                className="w-5 h-5 inline-block"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyRow;
