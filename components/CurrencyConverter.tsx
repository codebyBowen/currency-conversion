import React, { useState, useEffect, useRef } from "react";
import { CurrenyAmountProps } from "@/app/lib/definitions";
import data from "@/utils/Common-Currency.json";
import { currencies } from "@/app/convert/page";

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
    onBaseCurrencyChange,
    onCurrencyClick,
  } = props;
  const [inputAmount, setInputAmount] = useState<number>(
    typeof amount === "number" ? amount : 0
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleCurrencyChange = (newCurrency: string) => {
    if (onBaseCurrencyChange) {
      onBaseCurrencyChange(newCurrency);
    }
    setIsDropdownOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only trigger onCurrencyClick if it's not the dropdown that was clicked
    if (!isDropdownOpen) {
      onCurrencyClick(currency);
    }
  };

  const handleDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg max-w-md mx-auto border-solid border-2 border-slate-300 mb-3"
      onClick={handleClick}
    >
      <div
        className="flex items-center space-x-2 w-1/3 relative"
        ref={dropdownRef}
      >
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${currency
            .substring(0, 2)
            .toLowerCase()}.svg`}
          width="25"
          alt={`${currency} flag`}
        />
        <span className="font-semibold">{currency}</span>
        {defaultRow && (
          <span
            className="text-gray-400 cursor-pointer"
            onClick={handleDropdownToggle}
          >
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
        {isDropdownOpen && currencies && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
            {currencies.map((curr) => (
              <div
                key={curr.code}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCurrencyChange(curr.code)}
              >
                {curr.code}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end w-1/2">
        {defaultRow ? (
          <div className="flex items-center">
            <span>{`${data[currency].symbol_native}`}</span>
            <input
              type="text"
              value={formatNumber(inputAmount, 0)}
              onChange={handleInputChange}
              className="w-24 text-right font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>
        ) : typeof amount === "number" ? (
          <div className="text-right">
            <p className="w-auto text-right font-semibold">{`${
              data[currency].symbol_native
            } ${formatNumber(amount)}`}</p>
            {
              <p className="text-xs text-gray-500">{`1 ${selectedCurrency} = ${rates?.toFixed(
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
          <div
            onClick={() =>
              onAmountChange ? onAmountChange(inputAmount) : null
            }
          >
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
