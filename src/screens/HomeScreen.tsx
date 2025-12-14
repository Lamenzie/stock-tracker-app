import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { TabParamList } from "../navigation/AppNavigator";
import {
    calculatePortfolio,
    PortfolioSummary,
} from "../services/portfolioService";

type HomeNav = BottomTabNavigationProp<TabParamList, "Home">;

type Props = {
    navigation: HomeNav;
};

export default function HomeScreen({ navigation }: Props) {
    const [summary, setSummary] = useState<PortfolioSummary | null>(null);

    useFocusEffect(
        useCallback(() => {
        load();
        }, [])
    );

    async function load() {
        const data = await calculatePortfolio();
        setSummary(data);
    }

    if (!summary) return null;

    const positive = summary.profit >= 0;

    return (
        <View style={styles.container}>
        <Text style={styles.header}>LlamaStockTracker</Text>
        <Text style={styles.title}>Moje portfolio</Text>

        <Text style={styles.value}>
            {summary.currentValue.toFixed(2)} $
        </Text>

        <Text
            style={[
            styles.profit,
            positive ? styles.positive : styles.negative,
            ]}
        >
            {positive ? "+" : ""}
            {summary.profit.toFixed(2)} $ (
            {summary.profitPercent.toFixed(2)} %)
        </Text>

        <View style={styles.actions}>
            <Pressable
            style={styles.actionBtn}
            onPress={() => navigation.navigate("Portfolio")}
            >
            <Text style={styles.actionText}>Portfolio</Text>
            </Pressable>

            <Pressable
            style={styles.actionBtn}
            onPress={() => navigation.navigate("Stocks")}
            >
            <Text style={styles.actionText}>Akcie</Text>
            </Pressable>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        color: "#666",
        marginBottom: 6,
    },
    value: {
        fontSize: 42,
        fontWeight: "bold",
        marginBottom: 4,
    },
    profit: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 30,
    },
    positive: {
        color: "#16a34a",
    },
    negative: {
        color: "#dc2626",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: "#A8ABAE",
        alignItems: "center",
    },
    actionText: {
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        fontSize: 32,
    }
});
