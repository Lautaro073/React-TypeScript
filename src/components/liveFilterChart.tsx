// LiveFilterChart.tsx
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useLiveFilterChartData } from '@/hooks/useLiveFilterChartData';
import { UseLiveFilterChartDataParams } from '@/types/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartLegend } from '@/components/chartLegend';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface LiveFilterChartProps extends UseLiveFilterChartDataParams {}

export const LiveFilterChart: React.FC<LiveFilterChartProps> = ({
  symbols,
  updateInterval,
  maxPoints,
  removeCount,
}) => {
  const liveData = useLiveFilterChartData({ symbols, updateInterval, maxPoints, removeCount });
  
  // Estado persistente para las líneas ocultas (por ejemplo, la de AAPL)
  const [hiddenSymbols, setHiddenSymbols] = useLocalStorage<string[]>('liveHiddenSymbols', []);

  const toggleSymbol = (label: string) => {
    setHiddenSymbols(prev => 
      prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]
    );
  };

  // Integramos el estado de ocultos en los datasets
  const chartData = useMemo(() => ({
    labels: liveData.labels,
    datasets: liveData.datasets.map(ds => ({
      ...ds,
      hidden: hiddenSymbols.includes(ds.label),
    })),
  }), [liveData, hiddenSymbols]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: 'Gráfico en Vivo - Filtro por Tiempo' },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Tiempo (HH:MM:SS)' },
        grid: { display: true },
      },
      y: {
        display: true,
        title: { display: true, text: 'Valor' },
        grid: { display: true },
      },
    },
  }), []);

  return (
    <div className="w-full" aria-label="Gráfico en vivo con filtro por tiempo">
      <ChartLegend datasets={chartData.datasets} toggleVisibility={toggleSymbol} />
      <div className="h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
