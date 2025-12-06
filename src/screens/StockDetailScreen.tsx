import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getStockQuote } from "../api/stocksApi";

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

    useEffect(() => {
        async function load() {
        const data = await getStockQuote(symbol);
        setPrice(data.price);
        setChange(data.change);
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
