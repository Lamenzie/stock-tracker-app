import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { addTransaction } from "../storage/portfolio";
import { RouteProp } from "@react-navigation/native";

type AddTransactionNav = NativeStackNavigationProp<
    RootStackParamList,
    "AddTransaction"
>;

type AddTransactionRoute = RouteProp<RootStackParamList, "AddTransaction">;

type Props = {
    navigation: AddTransactionNav;
    route: AddTransactionRoute;
};

export default function AddTransactionScreen({ navigation, route }: Props) {
    const { symbol, currentPrice } = route.params;

    const [type, setType] = useState<"BUY" | "SELL">("BUY");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState(currentPrice.toString());

    async function save() {
        if (!amount || !price) {
        alert("Vyplň množství a cenu.");
        return;
        }

        await addTransaction({
        symbol,
        type,
        amount: Number(amount),
        price: Number(price),
        });

        navigation.goBack();
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Přidat transakci ({symbol})</Text>

        <View style={styles.row}>
            <Button
            title="BUY"
            color={type === "BUY" ? "green" : "gray"}
            onPress={() => setType("BUY")}
            />
            <Button
            title="SELL"
            color={type === "SELL" ? "red" : "gray"}
            onPress={() => setType("SELL")}
            />
        </View>

        <Text>Množství (počet kusů):</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
        />

        <Text>Cena za kus ($):</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
        />

        <Button title="Uložit transakci" onPress={save} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#999",
        padding: 10,
        borderRadius: 5,
    },
});
