import AppNavigator from './src/navigation/AppNavigator';
import { useEffect } from 'react';
import { getStockQuote } from './src/api/stocksApi';

export default function App() {
  useEffect(() => {
    getStockQuote("AAPL")
      .then((data) => console.log("AAPL data:", data))
      .catch((err) => console.log("API ERROR:", err));
  }, []);


  return <AppNavigator />
}

