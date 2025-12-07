import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/AppNavigator";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../navigation/AppNavigator";

type HomeScreenNavigationProp = BottomTabNavigationProp<
    TabParamList,
    "Home"
>;

export default function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>LamaStockTracker</Text>
            <Text style={styles.text}>Vítej v aplikaci určené k sledování a zaznamenávání vlastněných či prodaných akcií 📈</Text>

            <Button
                title="Přejít na seznam akcií" 
                onPress={() => navigation.navigate("Stocks")}
            />
            <Button 
                title="Moje portfolio"
                onPress={() => navigation.navigate("Portfolio")}
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
    text: {
        textAlign: "center",
        padding: 10,
    },
});