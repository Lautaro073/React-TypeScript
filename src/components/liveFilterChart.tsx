import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useLiveFilterChartData } from '@/hooks/useLiveFilterChartData';
import { ChartLegend } from '@/components/chartLegend';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {  UseLiveFilterChartDataParams } from '@/types/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface LiveFinancialChartProps extends UseLiveFilterChartDataParams {}

export function LiveFinancialChart({
  financialData,
  symbols,
  updateInterval,
  maxPoints,
  removeCount,
}: LiveFinancialChartProps) {
  
  const liveData = useLiveFilterChartData({ financialData, symbols, updateInterval, maxPoints, removeCount });

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: { display: true, text: 'Gráfico en Vivo de Precios' },
    },
    scales: {
      x: {
        display: true,
        title: { display: true, text: 'Tiempo (HH:MM:SS)' },
        grid: { display: true },
      },
      y: {
        display: true,
        title: { display: true, text: 'Precio' },
        grid: { display: true },
      },
    },
  }), []);

  return (
    <div className="w-full" aria-label="Gráfico en vivo de precios">
      <ChartLegend datasets={liveData.datasets} toggleVisibility={(_label) => { /* Implementar si es necesario */ }} />
      <div className="h-96">
        <Line data={liveData} options={chartOptions} />
      </div>
    </div>
  );
}

export default LiveFinancialChart;
