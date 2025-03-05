import type { FinancialData, CardState } from "@/types/types";

export function initCardsState(data: FinancialData[], symbols: string[]): CardState[] {
  const grouped: Record<string, FinancialData[]> = {};
  for (const item of data) {
    grouped[item.symbol] = grouped[item.symbol] || [];
    grouped[item.symbol].push(item);
  }
  return symbols.map((sym) => {
    const arr = grouped[sym] || [];
    if (arr.length === 0) {
      return { symbol: sym, currentPrice: 0, previousPrice: 0, icon: '/icons/default.svg' };
    }
    const sorted = arr.sort((a, b) => a.timestamp - b.timestamp);
    const last = sorted[sorted.length - 1];
    return {
      symbol: sym,
      currentPrice: last.price,
      previousPrice: last.price,
    };
  });
}

export function pickRandomSymbols(symbols: string[]): string[] {
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...symbols].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function pickRandomPrice(arr: FinancialData[]): number {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx].price;
}
