import React from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { MOCK_STOCKS } from "../src/mock/stocks";
import { Stock } from "../src/types/stock"

type StocksScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "Stocks"
>;

type Props = {
    navigation: StocksScreenNavigationProp;
};

export default function StocksScreen({ navigation }: Props) {
    const renderItem = ({ item }: { item: Stock }) => {
        return (
            <TouchableOpacity 
                style={styles.item} 
                onPress={() => { 
                    console.log("Kliknuto na akcii:", item.symbol);
                }}
            >
                <View>
                    <Text style={styles.symbol}>{item.symbol}</Text>
                    <Text style={styles.price}>{item.price.toFixed(2)}</Text>
                </View>
                <View style={styles.itemFooter}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text
                        style={[
                            styles.change,
                            item.change >= 0 ? styles.positive : styles.negative,
                        ]}
                    >
                        {item.change >= 0 ? "+" : ""}
                        {item.change.toFixed(2)} %
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return(
        <View style={styles.container}>
            <FlatList
                data={MOCK_STOCKS}
                keyExtractor={(item) => item.symbol}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />

            <Button title="Zpět na Home" onPress={() => navigation.navigate("Home")}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    item: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    symbol: {
        fontSize: 18,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        fontWeight: "600",
    },
    name: {
        fontSize: 14,
        color: "#555",
        flex: 1,
    },
    change: {
        fontSize: 14,
        fontWeight: "600",
    },
    positive: {
        color: "green",
    },
    negative: {
        color: "red",
    },
});
