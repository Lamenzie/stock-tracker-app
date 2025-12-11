import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/AppNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/AppNavigator";
import { getPortfolioSummary } from "../storage/portfolio";

type HomeNav = BottomTabNavigationProp<
    TabParamList,
    "Home"
>;

export default function HomeScreen({ navigation }: { navigation: HomeNav }) {
    const [summary, setSummary] = useState({
        invested: 0,
        currentValue: 0,
        profit: 0,
        profitPercent: 0,
    });

    useEffect(() => {
        const load = async () => {
        const data = await getPortfolioSummary();
        setSummary(data);
        };

        const unsub = navigation.addListener("focus", load);
        return unsub;
    }, [navigation]);

    return (
        <View style={styles.container}>
        <Text style={styles.title}>LamaStockTracker</Text>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Moje portfolio</Text>

            <Text style={styles.label}>
            Investováno: <Text style={styles.value}>{summary.invested.toFixed(2)} $</Text>
            </Text>

            <Text style={styles.label}>
            Aktuální hodnota:{" "}
            <Text style={styles.value}>{summary.currentValue.toFixed(2)} $</Text>
            </Text>

            <Text
            style={[
                styles.label,
                summary.profit >= 0 ? styles.green : styles.red,
            ]}
            >
            Zisk/ztráta: {summary.profit.toFixed(2)} $ (
            {summary.profitPercent.toFixed(2)} %)
            </Text>
        </View>

        <Text style={styles.footerText}>Použij spodní menu pro navigaci</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 70,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    value: {
        fontWeight: "600",
    },
    green: {
        color: "green",
    },
    red: {
        color: "red",
    },
    footerText: {
        marginTop: 30,
        textAlign: "center",
        color: "#888",
    },
    }); 