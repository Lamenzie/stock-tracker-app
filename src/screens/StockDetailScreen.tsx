import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getStockQuote, getStockHistory } from "../api/stocksApi";
import Svg, { Path, Text as SvgText } from "react-native-svg";

type StockDetailNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "StockDetail"
>;

type Props = {
    navigation: StockDetailNavigationProp;
    route: { params: { symbol: string } };
};

export default function StockDetailScreen({ navigation, route }: Props) {
    const { symbol } = route.params;

    // ---------- STATES ----------
    const [price, setPrice] = useState<number | null>(null);
    const [change, setChange] = useState<number | null>(null);
    const [history, setHistory] = useState<{ date: string; price: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // ---------- LOAD DATA ----------
    useEffect(() => {
      async function load() {
        try {
          const quote = await getStockQuote(symbol);
          setPrice(quote.price);
          setChange(quote.change);

          const hist = await getStockHistory(symbol);
          setHistory(hist.slice(-5)); // posledních 5 bodů
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);

    // ---------- GRAPH CALCULATIONS ----------
    const chartWidth = 350;
    const chartHeight = 180;
    const padding = 40;

    const simpleHistory = useMemo(() => history, [history]);

    const maxPrice = useMemo(
      () => Math.max(...simpleHistory.map((h) => h.price)),
      [simpleHistory]
    );
    const minPrice = useMemo(
      () => Math.min(...simpleHistory.map((h) => h.price)),
      [simpleHistory]
    );

    const range = maxPrice - minPrice || 1;

    const path = useMemo(() => {
      if (simpleHistory.length === 0) return "";

      return simpleHistory
        .map((p, i) => {
          const x =
            padding +
            (i * (chartWidth - padding * 2)) / (simpleHistory.length - 1);
          const y =
            padding +
            (1 - (p.price - minPrice) / range) * (chartHeight - padding * 2);
          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");
    }, [simpleHistory, minPrice, range]);

    // ---------- LOADING ----------
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Načítám data...</Text>
        </View>
      );
    }

    // ---------- UI ----------
    return (
      <View style={styles.container}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.price}>{price?.toFixed(2)} $</Text>

        <Text style={[styles.change, change! >= 0 ? styles.green : styles.red]}>
          {change! >= 0 ? "+" : ""}
          {change?.toFixed(2)} %
        </Text>

        {/* ---------- GRAPH ---------- */}
        <View style={{ marginTop: 30 }}>
          <Svg width={chartWidth} height={chartHeight}>
            {/* MIN VALUE LABEL */}
            <SvgText
              fill="#6b7280"
              fontSize="12"
              x={5}
              y={chartHeight - padding + 5}
            >
              {minPrice.toFixed(2)}
            </SvgText>

            {/* MAX VALUE LABEL */}
            <SvgText fill="#6b7280" fontSize="12" x={5} y={padding}>
              {maxPrice.toFixed(2)}
            </SvgText>

            {/* GRID */}
            <Path
              d={`M ${padding} ${padding} L ${chartWidth - padding} ${padding}`}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4"
            />

            <Path
              d={`M ${padding} ${chartHeight / 2} L ${chartWidth - padding} ${
                chartHeight / 2
              }`}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4"
            />

            <Path
              d={`M ${padding} ${chartHeight - padding} L ${
                chartWidth - padding
              } ${chartHeight - padding}`}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4"
            />

            {/* MAIN LINE */}
            <Path
              d={path}
              fill="none"
              stroke="#2563eb"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  symbol: {
    fontSize: 32,
    fontWeight: "bold",
  },
  price: {
    fontSize: 28,
    marginTop: 10,
  },
  change: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
  },
  green: {
    color: "green",
  },
  red: {
    color: "red",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
