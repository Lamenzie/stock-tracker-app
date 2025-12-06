const API_KEY = process.env.EXPO_PUBLIC_ALPHA_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export async function getStockQuote(symbol: string) {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network errori při volání API");
    }

    const data = await response.json();

    if (!data["Global Quote"]) {
        throw new Error("API vrátilo prázdná data (limit/špatný symbol)");
    }

    return {
        symbol,
        price: parseFloat(data["Global Quote"]["05. price"]),
        change: parseFloat(data["Global Quote"]["10. change percent"].replace("%", "")),
    };
}
