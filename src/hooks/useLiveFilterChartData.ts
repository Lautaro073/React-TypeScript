// src/hooks/useLiveFilterChartData.ts
import { useEffect, useState } from "react";
import { LiveChartData, UseLiveFilterChartDataParams } from "@/types/types";
import { pickRandomSymbols, pickRandomPrice } from "@/utils/dataUtils";
import { FinancialData } from "@/types/types";

export function useLiveFilterChartData({
  financialData,
  symbols,
  updateInterval,
  maxPoints,
  removeCount,
}: UseLiveFilterChartDataParams): LiveChartData {
  const LOCAL_STORAGE_KEY = 'liveFilterChartData';

  // Estado interno: se inicializa leyendo de localStorage (si existe) o con el estado inicial
  const [liveData, setLiveData] = useState<LiveChartData>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return {
      labels: [],
      datasets: symbols.map((symbol, index): LiveChartData["datasets"][number] => ({
        label: symbol,
        data: [],
        fill: false,
        backgroundColor: 'transparent',
        borderColor: [
          'rgba(75,192,192,1)',
          'rgba(192,75,192,1)',
          'rgba(192,192,75,1)',
          'rgba(75,75,192,1)',
          'rgba(192,75,75,1)',
        ][index % 5],
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        hidden: false,
      })),
    };
  });

  // Efecto de actualización cada updateInterval
  useEffect(() => {
    if (financialData.length === 0) return;

    // Agrupamos la data financiera por símbolo
    const grouped: Record<string, FinancialData[]> = {};
    for (const item of financialData) {
      grouped[item.symbol] = grouped[item.symbol] || [];
      grouped[item.symbol].push(item);
    }
    // Ordenamos cada grupo por timestamp
    Object.keys(grouped).forEach((symbol) => {
      grouped[symbol].sort((a, b) => a.timestamp - b.timestamp);
    });

    const intervalId = setInterval(() => {
      setLiveData((prevData: LiveChartData): LiveChartData => {
        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], { hour12: false });

        // Seleccionamos aleatoriamente algunos símbolos (como en las cards)
        const symbolsToUpdate = pickRandomSymbols(symbols);

        const updatedDatasets = prevData.datasets.map((dataset) => {
          let newValue: number;
          if (
            symbolsToUpdate.includes(dataset.label) &&
            grouped[dataset.label] &&
            grouped[dataset.label].length > 0
          ) {
            // Se obtiene un precio aleatorio del grupo, igual que en las cards
            newValue = pickRandomPrice(grouped[dataset.label]);
          } else {
            newValue = dataset.data[dataset.data.length - 1] || 100;
          }
          return {
            ...dataset,
            data: [...dataset.data, newValue],
          };
        });

        const updatedLabels = [...prevData.labels, timeLabel];

        // Si se supera el máximo de puntos, eliminamos de golpe el exceso
        if (updatedLabels.length > maxPoints) {
          const exceso = updatedLabels.length - maxPoints;
          updatedLabels.splice(0, exceso);
          updatedDatasets.forEach((dataset) => dataset.data.splice(0, exceso));
        }

        return {
          labels: updatedLabels,
          datasets: updatedDatasets,
        };
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [financialData, symbols, updateInterval, maxPoints, removeCount]);

  // Efecto de persistencia: cada vez que liveData cambia, se guarda en localStorage.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(liveData));
  }, [liveData]);

  return liveData;
}
