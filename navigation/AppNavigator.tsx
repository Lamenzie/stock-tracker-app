import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import StocksScreen from "../screens/StocksScreen";

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
    Home: undefined;
    Stocks: undefined;
};

export default function AppNavigator() {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{ title: "StockTracker+" }}
            />
            <Stack.Screen 
                name="Stocks" 
                component={StocksScreen} 
                options={{ title: "Akcie" }}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
}
