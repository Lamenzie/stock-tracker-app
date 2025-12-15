import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TabParamList } from "../navigation/AppNavigator";
import {
    calculatePortfolio,
    PortfolioSummary,
} from "../services/portfolioService";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView edges={["top"]} style={{ flex: 1}}>
        <View style={styles.container}>
            {/* ===== HERO ===== */}
            <LinearGradient
            colors={["#020617", "#252d41ff"]}
            style={styles.hero}
            >
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
            </LinearGradient>
        
        <View style={styles.middle} />

            {/* ===== ACTIONS ===== */}
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
    </SafeAreaView>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    hero: {
        flex: 0.55,
        paddingTop: 70,
        paddingBottom: 30,
        borderBottomLeftRadius: 125,
        borderBottomRightRadius: 125,
        justifyContent: "flex-start",
        alignItems: "center",
    },

    header: {
        fontSize: 32,
        color: "#c7d2fe",
        marginBottom: 20,
        marginTop: 10,
    },

    title: {
        fontSize: 20,
        color: "#94a3b8",
        marginBottom: 6,
    },

    value: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 6,
    },

    profit: {
        fontSize: 18,
        fontWeight: "600",
    },

    positive: {
        color: "#4ade80",
    },

    negative: {
        color: "#f87171",
    },

    actions: {
        flexDirection: "column",
        gap: 16,
        padding: 24,
        marginTop: 20,
    },

    actionBtn: {
        width: "100%", 
        paddingVertical: 24, 
        borderRadius: 16, 
        backgroundColor: "#020617",
        alignItems: "center",
        justifyContent: "center",
        elevation: 2, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    actionText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#ffffff",
    },
    middle: {
        flex: 0.15,
    },
});
