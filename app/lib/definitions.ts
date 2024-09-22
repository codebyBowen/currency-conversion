export interface CurrenyAmountProps {
  amount: number | React.ReactNode;
  currency: string;
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
