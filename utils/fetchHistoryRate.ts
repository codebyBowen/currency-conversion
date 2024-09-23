import axios from "axios";
import { ExchangeRateResponse } from "@/app/lib/definitions";

const fetchExchangeRates = async (
  baseCurrency: string = "USD",
  timeStamp: string
): Promise<ExchangeRateResponse> => {
  const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_EXCHANGE_RATE_BASE_URL;
  try {
    const response = await axios.get<ExchangeRateResponse>(
      `${BASE_URL}/historical/${timeStamp}.json?symbols=JPY,CAD,NZD,GBP,USD,AUD`,
      {
        params: {
          app_id: API_KEY,
          base: baseCurrency,
        },
      }
    );

    const { data } = response;
    const { rates, timestamp, base } = data;

    console.log('rates', rates)
    return rates;
  } catch (error) {
    console.error("Error fetching history exchange rates:", error);
    throw error;
  }
};

export default fetchExchangeRates;
