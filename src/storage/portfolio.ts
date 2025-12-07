import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../types/transaction";

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
