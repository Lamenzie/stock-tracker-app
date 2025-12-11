import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/AppNavigator";
import { getTransactions } from "../storage/portfolio";
import { Transaction } from "../types/transaction";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/AppNavigator";

type PortfolioNav = BottomTabNavigationProp<TabParamList, "Portfolio">;

type Props = {
    navigation: PortfolioNav;
};

type Holding = {
    symbol: string;
    totalAmount: number;
    avgPrice: number;
    invested: number;
};

export default function PortfolioScreen({ navigation }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [totalInvested, setTotalInvested] = useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
        loadData();
        });
        return unsubscribe;
    }, [navigation]);

    async function loadData() {
        const txs = await getTransactions();
        setTransactions(txs);

        const hMap: Record<string, { buyAmount: number; buyCost: number; sellAmount: number }> = {};

        for (const tx of txs) {
        if (!hMap[tx.symbol]) {
            hMap[tx.symbol] = { buyAmount: 0, buyCost: 0, sellAmount: 0 };
        }
        if (tx.type === "BUY") {
            hMap[tx.symbol].buyAmount += tx.amount;
            hMap[tx.symbol].buyCost += tx.amount * tx.price;
        } else {
            hMap[tx.symbol].sellAmount += tx.amount;
        }
        }

        const hArr: Holding[] = [];
        let total = 0;

        for (const symbol of Object.keys(hMap)) {
        const { buyAmount, buyCost, sellAmount } = hMap[symbol];
        const netAmount = buyAmount - sellAmount;
        if (netAmount <= 0) continue; // nic nedržím

        const avgPrice = buyCost / buyAmount;
        const invested = netAmount * avgPrice;
        total += invested;

        hArr.push({
            symbol,
            totalAmount: netAmount,
            avgPrice,
            invested,
        });
        }

        setHoldings(hArr);
        setTotalInvested(total);
    }

    const renderHolding = ({ item }: { item: Holding }) => (
        <View style={styles.card}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text>Držím: {item.totalAmount} ks</Text>
        <Text>Průměrná nákupka: {item.avgPrice.toFixed(2)} $</Text>
        <Text>Investováno: {item.invested.toFixed(2)} $</Text>
        </View>
    );

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.txRow}>
        <Text style={[styles.txType, item.type === "BUY" ? styles.buy : styles.sell]}>
            {item.type}
        </Text>
        <Text style={styles.txSymbol}>{item.symbol}</Text>
        <Text>
            {item.amount} ks @ {item.price.toFixed(2)} $
        </Text>
        <Text style={styles.txDate}>{new Date(item.date).toLocaleString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Moje portfolio</Text>
        <Text style={styles.total}>Celkem investováno: {totalInvested.toFixed(2)} $</Text>

        <Text style={styles.section}>Držené akcie:</Text>
        {holdings.length === 0 ? (
            <Text>Nemáš zatím žádné držené akcie.</Text>
        ) : (
            <FlatList
            data={holdings}
            keyExtractor={(item) => item.symbol}
            renderItem={renderHolding}
            />
        )}

        <Text style={styles.section}>Historie transakcí:</Text>
        {transactions.length === 0 ? (
            <Text>Žádné transakce.</Text>
        ) : (
            <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            />
        )}
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    total: {
        fontSize: 18,
        marginBottom: 12,
    },
    section: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "600",
    },
    card: {
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
    },
    symbol: {
        fontSize: 18,
        fontWeight: "bold",
    },
    txRow: {
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    txType: {
        fontWeight: "bold",
    },
    txSymbol: {
        fontSize: 16,
    },
    txDate: {
        fontSize: 11,
        color: "#666",
    },
    buy: {
        color: "green",
    },
    sell: {
        color: "red",
    },
});
