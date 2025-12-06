import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type HomeScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Home"
>;

export default function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>LamaStockTracker</Text>
            <Text>Vítej v aplikaci 📈</Text>
            <Text>API, portfolio, transakce == později</Text>

            <Button
                title="Přejít na seznam akcií" 
                onPress={() => navigation.navigate("Stocks")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
});