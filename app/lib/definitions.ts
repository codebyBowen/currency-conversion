export interface CurrenyAmountProps {
    amount: number | React.ReactNode;
    currency: string;
    symbol?: string;
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