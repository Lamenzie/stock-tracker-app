import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStockQuote } from "../api/stocksApi";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
    symbol: string;
    amount: number;
    price: number;
    type: "buy" | "sell";
    date: string;
};

type Holding = {
    symbol: string;
    amount: number;
    avgBuyPrice: number;
    invested: number;
    currentPrice: number;
    currentValue: number;
    profit: number;
    profitPercent: number;
};

export default function PortfolioScreen() {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPortfolio();
    }, []);

    async function loadPortfolio() {
        setLoading(true);

        const raw = await AsyncStorage.getItem("transactions");
        const transactions: Transaction[] = raw ? JSON.parse(raw) : [];

        const grouped: Record<
        string,
        { amount: number; invested: number }
        > = {};

        // 1️ seskupení transakcí
        for (const tx of transactions) {
        if (!grouped[tx.symbol]) {
            grouped[tx.symbol] = { amount: 0, invested: 0 };
        }

        if (tx.type === "buy") {
            grouped[tx.symbol].amount += tx.amount;
            grouped[tx.symbol].invested += tx.amount * tx.price;
        }

        if (tx.type === "sell") {
            grouped[tx.symbol].amount -= tx.amount;
            grouped[tx.symbol].invested -= tx.amount * tx.price;
        }
        }

        const result: Holding[] = [];

        // 2️ dopočítání z API
        for (const symbol of Object.keys(grouped)) {
        const data = grouped[symbol];

        if (data.amount <= 0) continue;

        const quote = await getStockQuote(symbol);

        const avgBuyPrice = data.invested / data.amount;
        const currentValue = data.amount * quote.price;
        const profit = currentValue - data.invested;
        const profitPercent =
            data.invested > 0 ? (profit / data.invested) * 100 : 0;

        result.push({
            symbol,
            amount: data.amount,
            invested: data.invested,
            avgBuyPrice,
            currentPrice: quote.price,
            currentValue,
            profit,
            profitPercent,
        });
        }

        setHoldings(result);
        setLoading(false);
    }

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Text>Načítám portfolio...</Text>
        </View>
        );
    }

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1}}>
        <View style={styles.container}>
        <Text style={styles.title}>Moje portfolio</Text>

        {holdings.length === 0 ? (
            <Text style={styles.empty}>Zatím nevlastníš žádné akcie</Text>
        ) : (
            <FlatList
            data={holdings}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => {
                const EPSILON = 0.01; // 1 cent

                const neutral = Math.abs(item.profit) < EPSILON;
                const positive = item.profit > EPSILON;
                const profitValue = neutral ? 0 : item.profit;
                const profitPercentValue = neutral ? 0 : item.profitPercent;

                
                    const profitStyle = neutral
                    ? styles.neutral
                    : positive
                    ? styles.green
                    : styles.red;
                
                    return (
                    <View style={styles.card}>
                        <Text style={styles.symbol}>{item.symbol}</Text>
                        <Text>{item.amount} ks</Text>
                
                        <Text>Průměrná nákupní cena: {item.avgBuyPrice.toFixed(2)} $</Text>
                        <Text>Aktuální cena: {item.currentPrice.toFixed(2)} $</Text>
                
                        <View style={styles.divider} />

                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Nákup celkem:</Text>
                            <Text style={styles.totalsValue}>
                                {(item.avgBuyPrice * item.amount).toFixed(2)} $
                            </Text>
                        </View>

                        <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Aktuální hodnota:</Text>
                        <Text style={styles.totalsValue}>
                            {(item.currentPrice * item.amount).toFixed(2)} $
                        </Text>
                        </View>

                        <Text style={[styles.profit, profitStyle]}>
                            {!neutral && positive ? "+" : ""}
                            {profitValue.toFixed(2)} $ ({profitPercentValue.toFixed(2)} %)
                        </Text>
                    </View>
                    );
                }}
            />
        )}
        </View>
        </SafeAreaView>
    );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },

    title: {
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 20,
        color: "#020617",
    },

    card: {
        padding: 18,
        borderRadius: 18,
        marginBottom: 18,
        borderWidth: 2,
        borderColor: "#020617",
        backgroundColor: "#f9fafb",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },

    symbol: {
        fontSize: 21,
        fontWeight: "800",
        marginBottom: 6,
        color: "#020617",
    },

    profit: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: "700",
    },

    green: {
        color: "#16a34a",
    },

    red: {
        color: "#dc2626",
    },

    neutral: {
        color: "#020617",
    },

    divider: {
        height: 1,
        backgroundColor: "#020617",
        opacity: 0.15,
        marginVertical: 12,
    },

    totalsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },

    totalsLabel: {
        color: "#475569",
        fontSize: 14,
    },

    totalsValue: {
        fontWeight: "700",
        fontSize: 14,
        color: "#020617",
    },

    empty: {
        color: "#64748b",
        fontSize: 16,
        marginTop: 20,
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});


