const API_KEY = process.env.EXPO_PUBLIC_ALPHA_KEY;
const BASE_URL = "https://financialmodelingprep.com/api/v3";

// ----- 1) aktuální cena akcie -----
export async function getStockQuote(symbol: string) {
    const url = `${BASE_URL}/quote/${symbol}?apikey=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Network error při volání API");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
        throw new Error("API vrátilo prázdná data (špatný symbol nebo vyčerpán limit)");
    }

    const stock = data[0];

    return {
        price: stock.price,
        change: stock.changesPercentage,
    };
}

// ----- 2) historická data -----
export async function getStockHistory(symbol: string) {
    const url = `${BASE_URL}/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.historical) {
        throw new Error("Chyba načítání historických dat");
    }

    return data.historical.slice(0, 10).reverse().map((item: any) => ({
        date: item.date,
        price: item.close,
    }));
}
