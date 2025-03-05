import { useEffect, useState } from "react"
import { FinancialData } from "@/types/financial"

interface CardState {
  symbol: string
  currentPrice: number
  previousPrice: number
}

function initCardsState(data: FinancialData[], symbols: string[]): CardState[] {
  const grouped: Record<string, FinancialData[]> = {}
  for (const item of data) {
    grouped[item.symbol] = grouped[item.symbol] || []
    grouped[item.symbol].push(item)
  }

  return symbols.map((sym) => {
    const arr = grouped[sym] || []
    if (arr.length === 0) {
      return { symbol: sym, currentPrice: 0, previousPrice: 0 }
    }
    const sorted = arr.sort((a, b) => a.timestamp - b.timestamp)
    const last = sorted[sorted.length - 1]
    return {
      symbol: sym,
      currentPrice: last.price,
      previousPrice: last.price,
    }
  })
}


function pickRandomSymbols(symbols: string[]): string[] {
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...symbols].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function pickRandomPrice(arr: FinancialData[]): number {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx].price
}

interface UseRandomCardPricesParams {
  financialData: FinancialData[]
  cardSymbols: string[]
  updateInterval: number 
}

export function useRandomCardPrices({
  financialData,
  cardSymbols,
  updateInterval= 1500,
}: UseRandomCardPricesParams) {
  const [cardsState, setCardsState] = useState<CardState[]>([])

  
  useEffect(() => {
    if (financialData.length > 0) {
      const initial = initCardsState(financialData, cardSymbols)
      setCardsState(initial)
    }
  }, [financialData, cardSymbols])

  
  useEffect(() => {
    if (financialData.length === 0) return;
  
    const grouped: Record<string, FinancialData[]> = {};
    for (const item of financialData) {
      grouped[item.symbol] = grouped[item.symbol] || [];
      grouped[item.symbol].push(item);
    }
  
    const intervalId = setInterval(() => {
     
      setCardsState((prev) => {
        const newState = [...prev];
        const symbolsToUpdate = pickRandomSymbols(cardSymbols);
        for (const sym of symbolsToUpdate) {
          const idx = newState.findIndex((card) => card.symbol === sym);
          if (idx !== -1 && grouped[sym] && grouped[sym].length > 0) {
            const oldPrice = newState[idx].currentPrice;
            const newPrice = pickRandomPrice(grouped[sym]);
            newState[idx] = {
              ...newState[idx],
              previousPrice: oldPrice,
              currentPrice: newPrice,
            };
          }
        }
        return newState;
      });
    }, updateInterval);
  
    return () => clearInterval(intervalId);
  }, [financialData, cardSymbols, updateInterval]);
  

  return cardsState
}
