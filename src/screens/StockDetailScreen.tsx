import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getStockQuote } from "../api/stocksApi";
import { getStockHistory } from "../api/stocksApi";
import Svg, { Polyline } from "react-native-svg";

type StockDetailNavigationProp = NativeStackNavigationProp<
        RootStackParamList,
        "StockDetail"
    >;

type Props = {
    navigation: StockDetailNavigationProp;
    route: { params: { symbol: string } };
    };

export default function StockDetailScreen({ navigation, route }: Props) {
    const { symbol } = route.params;

    const [price, setPrice] = useState<number | null>(null);
    const [change, setChange] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<{ date: string; price: number }[]>([]);

    useEffect(() => {
        async function load() {
        const data = await getStockQuote(symbol);
        setPrice(data.price);
        setChange(data.change);

        const hist = await getStockHistory(symbol);
        setHistory(hist);
        console.log("HISTORY:", hist);

        setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" />
            <Text>Načítám data...</Text>
        </View>
        );
    }

// ----- Normalizace pro GRAF SVG... -----
    const maxPrice = Math.max(...history.map((h) => h.price));
    const minPrice = Math.min(...history.map((h) => h.price));
    const range = maxPrice - minPrice || 1;

    const chartWidth = 350;
    const chartHeight = 200;

    const points = history
        .map((p, i) => {
        const x = i * (chartWidth / (history.length - 1));
        const y = chartHeight - ((p.price - minPrice) / range) * chartHeight;
        return `${x},${y}`;
        })
        .join(" ");

    return (
        <View style={styles.container}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.price}>{price?.toFixed(2)} $</Text>

        <Text
            style={[
            styles.change,
            change! >= 0 ? styles.green : styles.red,
            ]}
        >
            {change! >= 0 ? "+" : ""}
            {change?.toFixed(2)} %
        </Text>

        {/* GRAF */}
        <View style={{ marginTop: 40 }}>
            <Svg height={chartHeight} width={chartWidth}>
            <Polyline
                points={points}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
            />
            </Svg>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    symbol: {
        fontSize: 32,
        fontWeight: "bold",
    },
    price: {
        fontSize: 28,
        marginTop: 10,
    },
    change: {
        fontSize: 24,
        marginTop: 10,
        fontWeight: "bold",
    },
    green: {
        color: "green",
    },
    red: {
        color: "red",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});