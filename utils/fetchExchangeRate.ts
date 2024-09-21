import axios from "axios";
import { ExchangeRateResponse } from "@/app/lib/definitions";

// free account use can only use USD as based currency
const fetchExchangeRate = async (
  baseCurrency: string = "USD"
): Promise<ExchangeRateResponse> => {
    const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_EXCHANGE_RATE_BASE_URL;
  try {
    const response = await axios.get<ExchangeRateResponse>(
      `${BASE_URL}/latest.json`,
      {
        params: {
          app_id: API_KEY,
          base: baseCurrency,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exchange rates:", error, BASE_URL,API_KEY );
    throw error;
  }
};

export default fetchExchangeRate;
