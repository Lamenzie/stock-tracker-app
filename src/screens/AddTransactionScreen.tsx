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
  TouchableWithoutFeedback,
  Keyboard,
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
  const {
    symbol,
    currentPrice,
    mode = "buy",
    maxAmount,
  } = route.params;

  const [amount, setAmount] = useState("");

  async function saveTransaction() {
    const parsedAmount = Number(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Chyba", "Zadej platný počet kusů");
      return;
    }

    if (mode === "sell" && maxAmount && parsedAmount > maxAmount) {
      Alert.alert(
        "Chyba",
        "Nemůžeš prodat více kusů, než vlastníš"
      );
      return;
    }

    const newTransaction = {
      symbol,
      amount: parsedAmount,
      price: currentPrice,
      type: mode,
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {mode === "buy" ? "Nákup" : "Prodej"} akcie {symbol}
          </Text>

          <Text style={styles.label}>Aktuální cena</Text>
          <Text style={styles.price}>
            {currentPrice.toFixed(2)} $
          </Text>

          <Text style={styles.label}>
            {mode === "buy"
              ? "Počet kusů"
              : `Počet kusů (max ${maxAmount})`}
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Např. 5"
            returnKeyType="done"
          />

          <View style={{ flex: 1 }} />

          <Pressable style={styles.saveBtn} onPress={saveTransaction}>
            <Text style={styles.saveText}>
              {mode === "buy"
                ? "Uložit nákup"
                : "Prodat akcie"}
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  price: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  input: {
    fontSize: 22,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#2563eb",
  },
  saveBtn: {
    backgroundColor: "#020617",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
