import React, { useState, useEffect } from "react";
import { CurrenyAmountProps } from "@/app/lib/definitions";

const CurrencyRow = (props: CurrenyAmountProps) => {
  const { currency, amount, defaultRow } = props;
  const [inputAmount, setInputAmount] = useState<number | string>(
    typeof amount === "number" ? amount : 0
  );

  useEffect(() => {
    if (typeof amount === "number") {
      setInputAmount(amount);
    }
  }, [amount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setInputAmount(isNaN(value) ? "" : value);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <img
            src={`https://hatscripts.github.io/circle-flags/flags/${currency
              .substring(0, 2)
              .toLowerCase()}.svg`}
            width="25"
            alt={`${currency} flag`}
          />
          <div className="flex items-center space-x-1">
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
        <div className="flex items-center space-x-2">
          {defaultRow ? (
            <input
              type="number"
              value={inputAmount}
              onChange={handleInputChange}
              className="w-24 text-right font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
            />
          ) : typeof amount === "number" ? (
            <p className="w-24 text-right font-semibold">{amount.toFixed(2)}</p>
          ) : (
            amount // This will render the loading animation when amount is a ReactNode
          )}
          {defaultRow && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyRow;
