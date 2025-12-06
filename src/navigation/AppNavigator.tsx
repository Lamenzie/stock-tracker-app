import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import StocksScreen from "../screens/StocksScreen";
import StockDetailScreen from "../screens/StockDetailScreen";

export type RootStackParamList = {
    Home: undefined;
    Stocks: undefined;
    StockDetail: { symbol: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: "LlamaStockTracker+" }}
            />
            <Stack.Screen 
                name="Stocks" 
                component={StocksScreen} 
                options={{ title: "Akcie" }}
            />
            <Stack.Screen 
                name="StockDetail"
                component={StockDetailScreen}
                options={{ title: "Detail Akcie" }}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
}
