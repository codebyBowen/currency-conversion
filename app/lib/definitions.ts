import data from "@/utils/Common-Currency.json";
export interface CurrenyAmountProps {
  amount: number | React.ReactNode;
  currency: keyof typeof data;
  symbol?: string;
  selectedCurrency?: string;
  rates?: number;
  onAmountChange?: (amount: number) => void;
  onBaseCurrencyChange?: (baseCurrency: string) => void;
  defaultRow: boolean;
}

export interface ExchangeRateResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: {
    [currency: string]: number;
  };
}
