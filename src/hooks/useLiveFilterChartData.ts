// useLiveFilterChartData.ts
import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LiveChartData } from '@/types/types';

export interface UseLiveFilterChartDataParams {
  symbols: string[];
  updateInterval: number;
  maxPoints: number;
  removeCount: number;
}

export function useLiveFilterChartData({
  symbols,
  updateInterval,
  maxPoints,
  removeCount,
}: UseLiveFilterChartDataParams): LiveChartData {
  const LOCAL_STORAGE_KEY = 'liveFilterChartData';

  // Inicializamos el estado con persistencia utilizando useLocalStorage.
  const [liveData, setLiveData] = useLocalStorage<LiveChartData>(LOCAL_STORAGE_KEY, {
    labels: [],
    datasets: symbols.map((symbol, index): LiveChartData['datasets'][number] => ({
      label: symbol,
      data: [] as number[],
      fill: false,
      backgroundColor: 'transparent',
      borderColor: ['rgba(75,192,192,1)', 'rgba(192,75,192,1)', 'rgba(192,192,75,1)', 'rgba(75,75,192,1)', 'rgba(192,75,75,1)'][index % 5],
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
      hidden: false,
    })),
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLiveData((prevData: LiveChartData): LiveChartData => {
        // Generamos la etiqueta con la hora actual en formato HH:MM:SS.
        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], { hour12: false });

        // Actualizamos cada dataset: si tiene datos, agregamos un delta aleatorio; si no, iniciamos con un valor aleatorio.
        const updatedDatasets = prevData.datasets.map(
          (dataset: LiveChartData['datasets'][number]): LiveChartData['datasets'][number] => {
            let newValue: number;
            if (dataset.data.length > 0) {
              const lastValue = dataset.data[dataset.data.length - 1];
              const delta = (Math.random() - 0.5) * 10; // Variación entre -5 y +5
              newValue = lastValue + delta;
            } else {
              newValue = 100 + Math.random() * 100;
            }
            return {
              ...dataset,
              data: [...dataset.data, newValue],
            };
          }
        );

        const updatedLabels = [...prevData.labels, timeLabel];

        // Si se supera el máximo de puntos, removemos los datos antiguos.
        if (updatedLabels.length > maxPoints) {
          updatedLabels.splice(0, removeCount);
          updatedDatasets.forEach(
            (dataset: LiveChartData['datasets'][number]) => dataset.data.splice(0, removeCount)
          );
        }

        return {
          labels: updatedLabels,
          datasets: updatedDatasets,
        };
      });
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [updateInterval, maxPoints, removeCount, setLiveData]);

  return liveData;
}
