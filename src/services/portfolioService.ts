import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStockQuote } from "../api/stocksApi";

export type PortfolioSummary = {
    invested: number;
    currentValue: number;
    profit: number;
    profitPercent: number;
};

export async function calculatePortfolio(): Promise<PortfolioSummary> {
    const raw = await AsyncStorage.getItem("transactions");
    const transactions = raw ? JSON.parse(raw) : [];

    if (transactions.length === 0) {
        return {
            invested: 0,
            currentValue: 0,
            profit: 0,
            profitPercent: 0,
        };
    }

    // symbol → { shares, invested }
    const portfolio: Record<
        string,
        { shares: number; invested: number }
    > = {};

    for (const tx of transactions) {
        if (!portfolio[tx.symbol]) {
            portfolio[tx.symbol] = { shares: 0, invested: 0 };
        }

        if (tx.type === "buy") {
            portfolio[tx.symbol].shares += tx.amount;
            portfolio[tx.symbol].invested += tx.amount * tx.price;
        }

        if (tx.type === "sell") {
            const avgPrice =
                portfolio[tx.symbol].invested /
                portfolio[tx.symbol].shares;

            portfolio[tx.symbol].shares -= tx.amount;
            portfolio[tx.symbol].invested -= tx.amount * avgPrice;
        }
    }

    let invested = 0;
    let currentValue = 0;

    for (const symbol of Object.keys(portfolio)) {
        if (portfolio[symbol].shares <= 0) continue;

        invested += portfolio[symbol].invested;

        const quote = await getStockQuote(symbol);
        currentValue += portfolio[symbol].shares * quote.price;
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
