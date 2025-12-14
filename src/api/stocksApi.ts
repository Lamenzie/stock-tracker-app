import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "b81600657c6145ec89125f23241f92c0";
const BASE_URL = "https://api.twelvedata.com";

// ===== CACHE KONSTANTY =====
const PRICE_CACHE_TTL = 5 * 60 * 1000;      // 5 minut
const HISTORY_CACHE_TTL = 60 * 60 * 1000;   // 1 hodina

// ===== POMOCNÉ CACHE FUNKCE =====
async function getCache<T>(key: string, ttl: number): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }

    return null;
}

async function setCache(key: string, data: any) {
    await AsyncStorage.setItem(
        key,
        JSON.stringify({
        timestamp: Date.now(),
        data,
        })
    );
}

// ======================================================
// 1️ AKTUÁLNÍ CENA AKCIE (S CACHE)
// ======================================================
export async function getStockQuote(symbol: string) {
    const cacheKey = `price_${symbol}`;

    // zkus cache
    const cachedPrice = await getCache<number>(cacheKey, PRICE_CACHE_TTL);
    if (cachedPrice !== null) {
        return {
        price: cachedPrice,
        change: 0,
        };
    }

    // API call
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

    await setCache(cacheKey, price);

    return {
        price,
        change: 0,
    };
}

// ======================================================
// 2️ HISTORICKÁ DATA (S CACHE)
// ======================================================
export async function getStockHistory(symbol: string) {
    const cacheKey = `history_${symbol}`;

    // zkus cache
    const cachedHistory = await getCache<any[]>(cacheKey, HISTORY_CACHE_TTL);
    if (cachedHistory !== null) {
        return cachedHistory;
    }

    // API call
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

    const history = data.values
        .slice(0, 10)
        .reverse()
        .map((item: any) => ({
        date: item.datetime,
        price: parseFloat(item.close),
        }));

    await setCache(cacheKey, history);

    return history;
}

export async function getStockIntradayHistory(symbol: string) {
    const url = `${BASE_URL}/time_series?symbol=${symbol}&interval=5min&outputsize=78&apikey=${API_KEY}`;
    console.log("DEBUG getStockIntradayHistory:", url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Intraday error (${response.status})`);
    }

    const data = await response.json();

    if (!data || !data.values) {
        throw new Error("Chyba načítání intradenních dat");
    }

    return data.values
        .slice()
        .reverse()
        .map((item: any) => ({
        date: item.datetime,
        price: parseFloat(item.close),
        }));
}
