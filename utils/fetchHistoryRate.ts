import axios from "axios";
import { ExchangeRateResponse } from "@/app/lib/definitions";

const fetchExchangeRates = async (
  baseCurrency: string = "USD"
): Promise<ExchangeRateResponse> => {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_EXCHANGE_RATE_BASE_URL;

  try {
    const response = await axios.get<ExchangeRateResponse>(
      `${BASE_URL}/v1/latest`,
      {
        params: {
          apikey: API_KEY,
          base_currency: baseCurrency,
        },
      }
    );
    
    const transformedData: ExchangeRateResponse = {
      base: response.data.base_currency,
      rates: response.data.data,
      timestamp: response.data.last_updated_at,
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
};

export default fetchExchangeRates;