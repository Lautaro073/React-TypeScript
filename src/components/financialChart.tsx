import  { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
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
import { FinancialChartProps } from '@/types/types';
import { useLiveFilterChartData } from '@/hooks/useLiveFilterChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function FinancialChart({
  financialData,
  selectedSymbols,
  live = false,
  updateInterval = 1000,
  maxPoints = 20,
  removeCount = 1,
}: FinancialChartProps) {
  // Estado para manejar la visibilidad de las líneas.
  const [hiddenSymbols, setHiddenSymbols] = useState<string[]>([]);
  const toggleSymbol = (label: string) => {
    setHiddenSymbols((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  // Llamamos al hook de datos en vivo siempre, aunque no se use en modo histórico.
  const liveChartData = useLiveFilterChartData({
    financialData,
    symbols: selectedSymbols,
    updateInterval,
    maxPoints,
    removeCount,
  });

  // Calculamos la data histórica (modo no live)
  const historicalData = useMemo(() => {
    const filteredData = financialData.filter((item) =>
      selectedSymbols.includes(item.symbol)
    );
    // Agrupamos por día (reseteando la hora) para obtener fechas únicas.
    const dateSet = new Set<number>();
    filteredData.forEach((item) => {
      const dayStart = new Date(item.timestamp);
      dayStart.setHours(0, 0, 0, 0);
      dateSet.add(dayStart.getTime());
    });
    const sortedDates = Array.from(dateSet).sort((a, b) => a - b);
    const labels = sortedDates.map((ts) => new Date(ts).toLocaleDateString());
    const colors = [
      'rgba(75,192,192,1)',
      'rgba(192,75,192,1)',
      'rgba(192,192,75,1)',
      'rgba(75,75,192,1)',
      'rgba(192,75,75,1)',
    ];
    const datasets = selectedSymbols.map((symbol, index) => {
      const symbolDataMap: Record<number, number> = {};
      filteredData
        .filter((item) => item.symbol === symbol)
        .forEach((item) => {
          const dayStart = new Date(item.timestamp);
          dayStart.setHours(0, 0, 0, 0);
          symbolDataMap[dayStart.getTime()] = item.price;
        });
      const data = sortedDates.map((ts) => symbolDataMap[ts] ?? null);
      return {
        label: symbol,
        data,
        fill: true,
        backgroundColor: 'transparent',
        borderColor: colors[index % colors.length],
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        hidden: hiddenSymbols.includes(symbol),
      };
    });
    return { labels, datasets };
  }, [financialData, selectedSymbols, hiddenSymbols]);

  // Decidimos qué data usar según el modo
  const chartData = useMemo(() => {
    if (live) {
      return {
        labels: liveChartData.labels,
        datasets: liveChartData.datasets.map((ds) => ({
          ...ds,
          hidden: hiddenSymbols.includes(ds.label),
        })),
      };
    } else {
      return historicalData;
    }
  }, [live, liveChartData, historicalData, hiddenSymbols]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        title: {
          display: true,
          text: live ? 'Gráfico en Vivo de Precios' : 'Evolución del Precio de Acciones',
        },
      },
      scales: {
        x: {
          display: true,
          title: { display: true, text: live ? 'Tiempo (HH:MM:SS)' : 'Fecha' },
          grid: { display: true },
        },
        y: {
          display: true,
          title: { display: true, text: 'Precio' },
          grid: { display: true },
        },
      },
    }),
    [live]
  );

  return (
    <div
      className="w-full"
      aria-label={live ? 'Gráfico en vivo de precios' : 'Gráfico de evolución del precio de acciones'}
    >
      <ChartLegend datasets={chartData.datasets} toggleVisibility={toggleSymbol} />
      <div className="h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default FinancialChart;
