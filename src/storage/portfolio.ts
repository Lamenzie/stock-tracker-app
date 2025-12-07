import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../types/transaction";
import { getStockQuote } from "../api/stocksApi";

const STORAGE_KEY = "PORTFOLIO_TRANSACTIONS";

// Pomocná funkce pro generování unikátního ID (místo UUID)
function generateId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}

// -------------------- ULOŽENÍ TRANSAKCE --------------------
export async function addTransaction(tx: Omit<Transaction, "id" | "date">) {
    const existing = await getTransactions();

    const newTx: Transaction = {
        ...tx,
        id: generateId(),
        date: new Date().toISOString(),
    };

    const updated = [...existing, newTx];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newTx;
}

// -------------------- NAČTENÍ VŠECH TRANSAKCÍ --------------------
export async function getTransactions(): Promise<Transaction[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    try {
        return JSON.parse(json);
    } catch {
        return [];
    }
}

// -------------------- SMAZÁNÍ VŠECH TRANSAKCÍ (pro testování) --------------------
export async function clearTransactions() {
    await AsyncStorage.removeItem(STORAGE_KEY);
}

// -------------------- NAČTENÍ AKTUÁLNÍ HODNOTY PORTFOLIA -------------------
export async function getPortfolioSummary() {
    const txs = await getTransactions();

    if (txs.length === 0) {
        return {
        invested: 0,
        currentValue: 0,
        profit: 0,
        profitPercent: 0,
        };
    }

    const map: Record<string, { buyAmount: number; buyCost: number; sellAmount: number }> = {};

    for (const tx of txs) {
        if (!map[tx.symbol]) {
        map[tx.symbol] = { buyAmount: 0, buyCost: 0, sellAmount: 0 };
        }
        if (tx.type === "BUY") {
        map[tx.symbol].buyAmount += tx.amount;
        map[tx.symbol].buyCost += tx.amount * tx.price;
        } else {
        map[tx.symbol].sellAmount += tx.amount;
        }
    }

    let invested = 0;
    let currentValue = 0;

    for (const symbol of Object.keys(map)) {
        const { buyAmount, buyCost, sellAmount } = map[symbol];
        const netAmount = buyAmount - sellAmount;
        if (netAmount <= 0) continue;

        const avgPrice = buyCost / buyAmount;
        invested += netAmount * avgPrice;

        try {
        const quote = await getStockQuote(symbol); 
        currentValue += quote.price * netAmount;
        } catch (err) {
        console.log("API limit:", err);
        }
    }

    const profit = currentValue - invested;
    const profitPercent = invested > 0 ? (profit / invested) * 100 : 0;

    return {
        invested,
        currentValue,
        profit,
        profitPercent,
    };
}