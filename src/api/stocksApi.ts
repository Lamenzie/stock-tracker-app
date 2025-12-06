const API_KEY = process.env.EXPO_PUBLIC_ALPHA_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

// ----- 1) aktualni cena akcie -----
export async function getStockQuote(symbol: string) {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network error při volání API");
    }

    const data = await response.json();

    if (!data["Global Quote"]) {
        throw new Error("API vrátilo prázdná data (limit/špatný symbol)");
    }

    return {
        price: parseFloat(data["Global Quote"]["05. price"]),
        change: parseFloat(data["Global Quote"]["10. change percent"].replace("%", "")),
    };
}

// -----2) historicka cast akcie -----
export async function getStockHistory(symbol: string) {
    const url = `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const series = data["Time Series (Daily)"];
    if (!series) {
        throw new Error("Chyba načtení historických dat");
    }

    const result = Object.keys(series)
        .slice(0, 10)
        .map((date) => ({
        date,
        price: parseFloat(series[date]["4. close"]),
        }))
        .reverse();

    return result;
}