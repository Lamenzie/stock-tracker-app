export type Transaction = {
    id: string;
    symbol: string;
    type: "BUY" | "SELL";
    amount: number;
    price: number;
    date: string;
};
