import type { FinancialData, CardState } from '@/types/types';

export function initCardsState(
  data: FinancialData[],
  symbols: string[]
): CardState[] {
  //  Agrupa los datos financieros por símbolo para facilitar la inicialización de las tarjetas.
  const grouped: Record<string, FinancialData[]> = {};
  for (const item of data) {
    grouped[item.symbol] = grouped[item.symbol] || [];
    grouped[item.symbol].push(item);
  }
  return symbols.map((sym) => {
    const arr = grouped[sym] || [];
    if (arr.length === 0) {
      return {
        symbol: sym,
        currentPrice: 0,
        previousPrice: 0,
        icon: '/icons/default.svg',
      };
    }
    //  Ordena los datos por timestamp para obtener el registro más reciente.
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
  //  Selecciona un número aleatorio (entre 1 y 3) de símbolos de la lista de forma aleatoria.
  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...symbols].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function pickRandomPrice(arr: FinancialData[]): number {
  //  Escoge aleatoriamente un precio de entre los datos financieros disponibles.
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx].price;
}
