import { useMemo } from 'react';
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
import { useLocalStorage } from '@/hooks/useLocalStorage';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export function FinancialChart({
  financialData,
  selectedSymbols,
  live = false,
  updateInterval = 1000,
  maxPoints = 20,
  removeCount = 1,
}: FinancialChartProps) {
  const [hiddenSymbols, setHiddenSymbols] = useLocalStorage<string[]>(
    'liveHiddenSymbols',
    []
  );

  const toggleSymbol = (label: string) => {
    setHiddenSymbols((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const liveChartData = useLiveFilterChartData({
    financialData,
    symbols: selectedSymbols,
    updateInterval,
    maxPoints,
    removeCount,
  });

  //  Procesa los datos históricos para agruparlos por día y construir los conjuntos de datos para cada símbolo.
  const historicalData = useMemo(() => {
    // Filtra los datos para incluir solo los símbolos seleccionados.
    const filteredData = financialData.filter((item) =>
      selectedSymbols.includes(item.symbol)
    );
    // Crea un conjunto de fechas únicas (al inicio del día) de los datos filtrados.
    const dateSet = new Set<number>();
    filteredData.forEach((item) => {
      const dayStart = new Date(item.timestamp);
      dayStart.setHours(0, 0, 0, 0);
      dateSet.add(dayStart.getTime());
    });
    // Ordena las fechas y genera etiquetas legibles.
    const sortedDates = Array.from(dateSet).sort((a, b) => a - b);
    const labels = sortedDates.map((ts) => new Date(ts).toLocaleDateString());

    const colors = [
      'rgba(75,192,192,1)',
      'rgba(192,75,192,1)',
      'rgba(192,192,75,1)',
      'rgba(75,75,192,1)',
      'rgba(192,75,75,1)',
    ];

    // Para cada símbolo seleccionado, crea un mapeo de fecha a precio y genera el dataset correspondiente.
    const datasets = selectedSymbols.map((symbol, index) => {
      const symbolDataMap: Record<number, number> = {};
      filteredData
        .filter((item) => item.symbol === symbol)
        .forEach((item) => {
          const dayStart = new Date(item.timestamp);
          dayStart.setHours(0, 0, 0, 0);
          symbolDataMap[dayStart.getTime()] = item.price;
        });
      // Para cada fecha, asigna el precio correspondiente o null si no hay dato.
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

  //  Selecciona entre datos en vivo y datos históricos, aplicando la configuración de visibilidad según hiddenSymbols.
  const chartData = useMemo(() => {
    if (live) {
      return {
        labels: liveChartData.labels,
        datasets: liveChartData.datasets.map((ds) => ({
          ...ds,
          hidden: hiddenSymbols.includes(ds.label),
        })),
      };
    }
    return historicalData;
  }, [live, liveChartData, historicalData, hiddenSymbols]);

  //  Configura las opciones del gráfico, ajustando títulos y ejes según el modo en vivo o histórico.
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        title: {
          display: true,
          text: live
            ? 'Gráfico en Vivo de Precios'
            : 'Evolución del Precio de Acciones',
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
      aria-label={
        live
          ? 'Gráfico en vivo de precios'
          : 'Gráfico de evolución del precio de acciones'
      }
    >
      <ChartLegend
        datasets={chartData.datasets}
        toggleVisibility={toggleSymbol}
      />
      <div className="h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default FinancialChart;
