import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
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

    const [amount, setAmount] = useState<string>("");

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
        <View style={styles.container}>
        <Text style={styles.title}>Nákup akcie {symbol}</Text>

        <Text style={styles.label}>Aktuální cena</Text>
        <Text style={styles.price}>{currentPrice.toFixed(2)} $</Text>

        <Text style={styles.label}>Počet kusů</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Např. 5"
        />

        <Button title="Uložit transakci" onPress={saveTransaction} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        marginTop: 12,
        color: "#555",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
});
