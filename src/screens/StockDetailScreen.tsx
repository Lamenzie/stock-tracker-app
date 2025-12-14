import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Pressable,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import {
  getStockQuote,
  getStockHistory,
  getStockIntradayHistory,
} from "../api/stocksApi";
import Svg, { Path, Text as SvgText } from "react-native-svg";

type StockDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StockDetail"
>;

type Props = {
  navigation: StockDetailNavigationProp;
  route: { params: { symbol: string } };
};

type TimeRange = "1D" | "1M";
type Point = { date: string; price: number };

export default function StockDetailScreen({ navigation, route }: Props) {
  const { symbol } = route.params;

  const [price, setPrice] = useState<number | null>(null);
  const [history1M, setHistory1M] = useState<Point[]>([]);
  const [history1D, setHistory1D] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<TimeRange>("1M");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const quote = await getStockQuote(symbol);

        const [histM, histD] = await Promise.all([
          getStockHistory(symbol), // daily
          getStockIntradayHistory(symbol), // 5min
        ]);

        if (!mounted) return;

        setPrice(quote.price);
        setHistory1M(histM); // už máš cca 10 bodů (cache/limit u tebe)
        setHistory1D(histD);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [symbol]);

  // vyber data podle přepínače
  const chartData = useMemo(() => {
    return range === "1D" ? history1D : history1M;
  }, [range, history1D, history1M]);

  // výpočet % změny podle vybraného rozsahu
  const changePercent = useMemo(() => {
    if (!chartData || chartData.length < 2) return 0;

    const first = range === "1D" ? chartData[chartData.length - 2] : chartData[0];
    const last = chartData[chartData.length - 1];

    if (!first?.price || !last?.price) return 0;
    if (first.price === 0) return 0;

    return ((last.price - first.price) / first.price) * 100;
  }, [chartData, range]);

  // ===== SVG graf výpočty (full width) =====
  const screenW = Dimensions.get("window").width;
  const chartWidth = Math.min(screenW - 40, 420); // pěkné i na iPadu
  const chartHeight = 200;
  const padding = 28;

  const maxPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map((h) => h.price));
  }, [chartData]);

  const minPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map((h) => h.price));
  }, [chartData]);

  const rangeValue = maxPrice - minPrice || 1;

  const path = useMemo(() => {
    if (chartData.length < 2) return "";

    return chartData
      .map((p, i) => {
        const x =
          padding +
          (i * (chartWidth - padding * 2)) / (chartData.length - 1);

        const y =
          padding +
          (1 - (p.price - minPrice) / rangeValue) * (chartHeight - padding * 2);

        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [chartData, chartWidth, chartHeight, padding, minPrice, rangeValue]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Načítám data...</Text>
      </View>
    );
  }

  const positive = changePercent >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <Text style={styles.price}>{price?.toFixed(2)} $</Text>

      <Text style={[styles.change, positive ? styles.green : styles.red]}>
        {positive ? "+" : ""}
        {changePercent.toFixed(2)} %
      </Text>

      {/* ===== RANGE SWITCH ===== */}
      <View style={styles.switch}>
        <Pressable
          onPress={() => setRange("1D")}
          style={[styles.switchItem, range === "1D" && styles.switchActive]}
        >
          <Text style={range === "1D" ? styles.switchTextActive : undefined}>
            1D
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setRange("1M")}
          style={[styles.switchItem, range === "1M" && styles.switchActive]}
        >
          <Text style={range === "1M" ? styles.switchTextActive : undefined}>
            1M
          </Text>
        </Pressable>
      </View>

      {/* ===== GRAPH CARD ===== */}
      <View style={[styles.chartCard, { width: chartWidth + 20 }]}>
        {chartData.length < 2 ? (
          <Text style={{ color: "#666" }}>Graf zatím není k dispozici.</Text>
        ) : (
          <Svg width={chartWidth} height={chartHeight}>
            {/* labels */}
            <SvgText fill="#6b7280" fontSize="12" x={0} y={padding}>
              {maxPrice.toFixed(2)}
            </SvgText>

            <SvgText
              fill="#6b7280"
              fontSize="12"
              x={0}
              y={chartHeight - padding + 10}
            >
              {minPrice.toFixed(2)}
            </SvgText>

            {/* grid */}
            <Path
              d={`M ${padding} ${padding} L ${chartWidth - padding} ${padding}`}
              stroke="#e5e7eb"
              strokeDasharray="4"
            />
            <Path
              d={`M ${padding} ${chartHeight / 2} L ${chartWidth - padding} ${
                chartHeight / 2
              }`}
              stroke="#e5e7eb"
              strokeDasharray="4"
            />
            <Path
              d={`M ${padding} ${chartHeight - padding} L ${
                chartWidth - padding
              } ${chartHeight - padding}`}
              stroke="#e5e7eb"
              strokeDasharray="4"
            />

            {/* line */}
            <Path
              d={path}
              fill="none"
              stroke="#2563eb"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </View>

      <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 14 }}>
        <Button
          title="Přidat transakci"
          onPress={() =>
            navigation.navigate("AddTransaction", {
              symbol,
              currentPrice: price ?? 0,
            })
          }
        />
      </View>
    </View>
  );
}

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#fff",
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
    fontSize: 20,
    marginTop: 8,
    fontWeight: "700",
  },
  green: {
    color: "#16a34a",
  },
  red: {
    color: "#dc2626",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  switch: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 12,
  },
  switchItem: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
  },
  switchActive: {
    backgroundColor: "#000",
  },
  switchTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  chartCard: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
});
