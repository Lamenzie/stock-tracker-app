import React, {useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, ActivityIndicator} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Stock } from "../types/stock"
import { getStockQuote } from "../api/stocksApi";

type StocksScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Stocks"
>;

type Props = {
    navigation: StocksScreenNavigationProp;
};

export default function StocksScreen({ navigation }: Props) {
    const symbols = ["AAPL", "TSLA", "MSFT"];

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const results: Stock[] =[];

                for (const symbol of symbols){
                    const quote = await getStockQuote(symbol);

                    results.push({
                        symbol,
                        name: symbol,
                        price: quote.price,
                        change: quote.change,
                    });
                }

                setStocks(results);
            }
            catch (err: any) {
                setError(err.message || "Nastala chyba");
            }
            finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={{ marginTop: 10 }}>Načítám aktuální data...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
                <Button title="Zkusit znovu" onPress={() => navigation.replace("Stocks")} />
            </View>
        );
    }


    const renderItem = ({ item }: { item: Stock }) => {
        return (
            <TouchableOpacity 
                style={styles.item}
                onPress={() => navigation.navigate("StockDetail", { symbol: item.symbol })}
            >
                <View style={styles.itemHeader}>
                    <Text style={styles.symbol}>{item.symbol}</Text>
                    <Text style={styles.price}>{item.price.toFixed(2)} $</Text>
                </View>

                <View style={styles.itemFooter}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text
                        style={[
                            styles.change,
                            item.change >= 0 ? styles.positive : styles.negative,
                        ]}
                    >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)} %
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return(
        <View style={styles.container}>
            <FlatList<Stock>
                data={stocks}
                keyExtractor={(item) => item.symbol}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            <Button title="Zpět na Home" onPress={() => navigation.navigate("Home")}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
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
