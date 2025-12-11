const API_KEY = "b81600657c6145ec89125f23241f92c0";
const BASE_URL = "https://api.twelvedata.com";

// ----- 1) Aktuální cena -----
export async function getStockQuote(symbol: string) {
    const url = `${BASE_URL}/price?symbol=${symbol}&apikey=${API_KEY}`;
    console.log("DEBUG getStockQuote:", url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Network error (${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.price) {
        throw new Error("API returned empty data");
    }

    const price = parseFloat(data.price);

    return {
        price,
        change: 0, // později doplníme vypočítanou změnu
    };
}

// ----- 2) Historická data -----
export async function getStockHistory(symbol: string) {
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`;
    console.log("DEBUG getStockHistory:", url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`History error (${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.values) {
        throw new Error("Chyba načítání historických dat");
    }

    return data.values
        .slice(0, 10)
        .reverse()
        .map((item: any) => ({
        date: item.datetime,
        price: parseFloat(item.close),
        }));
}
