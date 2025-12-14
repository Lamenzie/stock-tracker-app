import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/AppNavigator";
import { Stock } from "../types/stock";
import { getStockQuote } from "../api/stocksApi";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type StackNav = NativeStackNavigationProp<RootStackParamList, "StockDetail">;

type StocksNav = BottomTabNavigationProp<TabParamList, "Stocks">;

type Props = {
    navigation: StocksNav & StackNav;
};


export default function StocksScreen({ navigation }: Props) {
    const symbols = [
        "AAPL", // Apple
        "MSFT", // Microsoft
        "GOOGL", // Google
        "META", // Facebook
        "TSLA", // Tesla
        "NVDA", // Nvidia
        "INTC", // Intel
        "AMD", // AMD
    ];

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadData() {
        try {
        setLoading(true);
        setError(null);

        const results: Stock[] = [];

        for (const symbol of symbols) {
        try {
            const quote = await getStockQuote(symbol);

            results.push({
            symbol,
            name: symbol,
            price: quote.price,
            change: quote.change,
            });
        } catch (err) {
            console.warn(`Skipping ${symbol}: API error`);
        }
        }

        setStocks(results);

        } catch (err: any) {
        console.log("StocksScreen API error:", err);
        setError(err.message || "Nastala chyba");
        } finally {
        setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={{ marginTop: 10 }}>Načítám aktuální data...</Text>
        </View>
        );
    }

    if (error) {
        return (
        <View style={styles.centered}>
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            <Button title="Zkusit znovu" onPress={loadData} />
        </View>
        );
    }

    const renderItem = ({ item }: { item: Stock }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() =>
                // Tohle jde do STACKU (StockDetail je screen ve Stacku)
                navigation.navigate("StockDetail", { symbol: item.symbol })
                }
            >
            <View style={styles.itemHeader}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.price}>{item.price.toFixed(2)} $</Text>
            </View>

            <View style={styles.itemFooter}>
                <Text style={styles.name}>{item.name}</Text>
            </View>
        </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
        <FlatList<Stock>
            data={stocks}
            keyExtractor={(item) => item.symbol}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
        />

        <View style={{ padding: 16 }}>
            <Button title="Zpět na Home" onPress={() => navigation.navigate("Home")} />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "E6E6E6",
    },
    listContent: {
        padding: 16,
    },
    item: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    symbol: {
        fontSize: 20,
        fontWeight: "bold",
    },
    price: {
        fontSize: 18,
        fontWeight: "600",
    },
    name: {
        fontSize: 14,
        color: "#555",
    },
    change: {
        fontSize: 16,
        fontWeight: "600",
    },
    positive: {
        color: "green",
    },
    negative: {
        color: "red",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
