import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { RouteProp } from "@react-navigation/native";

type AddTransactionNav = NativeStackNavigationProp<
    RootStackParamList,
    "AddTransaction"
>;

type Props = {
    navigation: AddTransactionNav;
    route: RouteProp<RootStackParamList, "AddTransaction">;
};

export default function AddTransactionScreen({ navigation, route }: Props) {
    const { symbol, currentPrice } = route.params;
    const [amount, setAmount] = useState("");

    async function saveTransaction() {
        const parsedAmount = Number(amount);

        if (!parsedAmount || parsedAmount <= 0) {
        Alert.alert("Chyba", "Zadej platný počet kusů");
        return;
        }

        const newTransaction = {
        symbol,
        amount: parsedAmount,
        price: currentPrice,
        type: "buy",
        date: new Date().toISOString(),
        };

        const raw = await AsyncStorage.getItem("transactions");
        const transactions = raw ? JSON.parse(raw) : [];

        transactions.push(newTransaction);

        await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
        );

        navigation.goBack();
}

    return (
        <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
        <View style={styles.container}>
            {/* ===== CONTENT ===== */}
            <View style={styles.content}>
            <Text style={styles.title}>Nákup akcie</Text>
            <Text style={styles.symbol}>{symbol}</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Aktuální cena</Text>
                <Text style={styles.price}>{currentPrice.toFixed(2)} $</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Počet kusů</Text>
                <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Např. 5"
                placeholderTextColor="#9ca3af"
                />
            </View>
            </View>

            {/* ===== BOTTOM ACTION ===== */}
            <View style={styles.bottom}>
            <Pressable style={styles.saveBtn} onPress={saveTransaction}>
                <Text style={styles.saveText}>Uložit transakci</Text>
            </Pressable>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    content: {
        flex: 1,
        padding: 24,
        alignItems: "center",
    },

    title: {
        fontSize: 30,
        fontWeight: "800",
        marginTop: 20,
    },

    symbol: {
        fontSize: 22,
        color: "#2563eb",
        marginBottom: 30,
    },

    card: {
        width: "100%",
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },

    label: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 6,
    },

    price: {
        fontSize: 26,
        fontWeight: "700",
    },

    input: {
        fontSize: 22,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderColor: "#2563eb",
    },

    bottom: {
        padding: 20,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#fff",
    },

    saveBtn: {
        backgroundColor: "#020617",
        paddingVertical: 18,
        borderRadius: 18,
        alignItems: "center",
    },

    saveText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});

