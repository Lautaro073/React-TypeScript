import { useEffect, useState } from 'react';
import {
  FinancialData,
  CardState,
  UseRealtimePriceUpdatesParams,
} from '@/types/types';
import {
  initCardsState,
  pickRandomSymbols,
  pickRandomPrice,
} from '@/utils/dataUtils';

export function useRealtimePriceUpdates({
  financialData,
  symbols,
  updateInterval,
}: UseRealtimePriceUpdatesParams): CardState[] {
  const [realtimeCards, setRealtimeCards] = useState<CardState[]>([]);

  useEffect(() => {
    if (financialData.length > 0) {
      const initialState = initCardsState(financialData, symbols);
      setRealtimeCards(initialState);
    }
  }, [financialData, symbols]);

  useEffect(() => {
    if (financialData.length === 0) return;

    //  Agrupa los datos financieros por símbolo para facilitar la actualización de cada tarjeta.
    const groupedData: Record<string, FinancialData[]> = {};
    for (const record of financialData) {
      groupedData[record.symbol] = groupedData[record.symbol] || [];
      groupedData[record.symbol].push(record);
    }

    const intervalId = setInterval(() => {
      setRealtimeCards((prevCards) => {
        const updatedCards = [...prevCards];
        const symbolsToUpdate = pickRandomSymbols(symbols);

        //  Actualiza aleatoriamente el precio de cada tarjeta basada en los datos agrupados.
        for (const sym of symbolsToUpdate) {
          const index = updatedCards.findIndex((card) => card.symbol === sym);
          if (index !== -1 && groupedData[sym] && groupedData[sym].length > 0) {
            const previousPrice = updatedCards[index].currentPrice;
            const newPrice = pickRandomPrice(groupedData[sym]);
            updatedCards[index] = {
              ...updatedCards[index],
              previousPrice,
              currentPrice: newPrice,
            };
          }
        }
        return updatedCards;
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [financialData, symbols, updateInterval]);

  return realtimeCards;
}
