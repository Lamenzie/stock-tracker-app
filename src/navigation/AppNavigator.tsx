import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import StocksScreen from "../screens/StocksScreen";
import StockDetailScreen from "../screens/StockDetailScreen";
import PortfolioScreen from "../screens/PortfolioScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";

export type RootStackParamList = {
    Tabs: undefined;
    StockDetail: { symbol: string };
    AddTransaction: { symbol: string; currentPrice: number };
};

export type TabParamList = {
    Home: undefined;
    Stocks: undefined;
    Portfolio: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator>
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Přehled" }}
        />
        <Tab.Screen
            name="Stocks"
            component={StocksScreen}
            options={{ title: "Akcie" }}
        />
        <Tab.Screen
            name="Portfolio"
            component={PortfolioScreen}
            options={{ title: "Portfolio" }}
        />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
            name="Tabs"
            component={TabNavigator}
            options={{ headerShown: false }}
            />
            <Stack.Screen
            name="StockDetail"
            component={StockDetailScreen}
            options={{ title: "Detail akcie" }}
            />
            <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ title: "Přidat transakci" }}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
}
