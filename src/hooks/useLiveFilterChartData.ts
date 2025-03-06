import { useEffect, useState } from 'react';
import { LiveChartData, UseLiveFilterChartDataParams } from '@/types/types';
import { pickRandomSymbols, pickRandomPrice } from '@/utils/dataUtils';
import { FinancialData } from '@/types/types';

export function useLiveFilterChartData({
  financialData,
  symbols,
  updateInterval,
  maxPoints,
  removeCount,
}: UseLiveFilterChartDataParams): LiveChartData {
  const LOCAL_STORAGE_KEY = 'liveFilterChartData';

  //  Inicializa el estado utilizando datos almacenados en localStorage (si existen),
  // o crea una estructura inicial con datasets vacíos para cada símbolo.
  const [liveData, setLiveData] = useState<LiveChartData>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return {
      labels: [],
      datasets: symbols.map(
        (symbol, index): LiveChartData['datasets'][number] => ({
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
        })
      ),
    };
  });

  useEffect(() => {
    if (financialData.length === 0) return;

    //  Agrupa los datos financieros por símbolo y ordena cada grupo por timestamp
    // para asegurar que los precios se procesen en orden cronológico.
    const grouped: Record<string, FinancialData[]> = {};
    for (const item of financialData) {
      grouped[item.symbol] = grouped[item.symbol] || [];
      grouped[item.symbol].push(item);
    }
    Object.keys(grouped).forEach((symbol) => {
      grouped[symbol].sort((a, b) => a.timestamp - b.timestamp);
    });

    const intervalId = setInterval(() => {
      setLiveData((prevData: LiveChartData): LiveChartData => {
        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], { hour12: false });

        //  Selecciona aleatoriamente algunos símbolos para actualizar,
        // de modo que solo ciertos datasets reciban un nuevo valor basado en datos reales.
        const symbolsToUpdate = pickRandomSymbols(symbols);

        const updatedDatasets = prevData.datasets.map((dataset) => {
          let newValue: number;
          if (
            symbolsToUpdate.includes(dataset.label) &&
            grouped[dataset.label] &&
            grouped[dataset.label].length > 0
          ) {
            newValue = pickRandomPrice(grouped[dataset.label]);
          } else {
            // Si no se actualiza, se conserva el último valor o se asigna un valor predeterminado.
            newValue = dataset.data[dataset.data.length - 1] || 100;
          }
          return {
            ...dataset,
            data: [...dataset.data, newValue],
          };
        });

        const updatedLabels = [...prevData.labels, timeLabel];

        // Si el número de puntos supera el máximo permitido (maxPoints),
        // elimina los puntos más antiguos para mantener el tamaño del dataset.
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

  //  Guarda el estado actualizado del gráfico en localStorage cada vez que liveData cambia,
  // permitiendo la persistencia de datos entre recargas.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(liveData));
  }, [liveData]);

  return liveData;
}
