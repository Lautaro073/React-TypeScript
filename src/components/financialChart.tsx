import React, { useMemo, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { FinancialData } from '../types/financial'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { ChartLegend } from '@/components/chartLegend'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

interface FinancialChartProps {
  financialData: FinancialData[]
  selectedSymbols: string[]
}

const LOCAL_STORAGE_KEY = 'hiddenSymbols'

const FinancialChart: React.FC<FinancialChartProps> = ({ financialData, selectedSymbols }) => {
  const [hiddenSymbols, setHiddenSymbols] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      setHiddenSymbols(JSON.parse(saved))
    }
  }, [])

  const toggleSymbol = (symbol: string) => {
    setHiddenSymbols((prev) => {
      let newHidden: string[]
      if (prev.includes(symbol)) {
        newHidden = prev.filter((s) => s !== symbol)
      } else {
        newHidden = [...prev, symbol]
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHidden))
      return newHidden
    })
  }

  const chartData = useMemo(() => {
    const filteredData = financialData.filter((item) =>
      selectedSymbols.includes(item.symbol)
    )
    const dateSet = new Set<number>()
    filteredData.forEach((item) => {
      const dayStart = new Date(item.timestamp)
      dayStart.setHours(0, 0, 0, 0)
      dateSet.add(dayStart.getTime())
    })

    const sortedDates = Array.from(dateSet).sort((a, b) => a - b)
    const labels = sortedDates.map((ts) => new Date(ts).toLocaleDateString())

    const colors = [
      'rgba(75,192,192,1)',
      'rgba(192,75,192,1)',
      'rgba(192,192,75,1)',
      'rgba(75,75,192,1)',
      'rgba(192,75,75,1)',
    ]

    const datasets = selectedSymbols.map((symbol, index) => {
      const symbolDataMap: Record<number, number> = {}

      filteredData
        .filter((item) => item.symbol === symbol)
        .forEach((item) => {
          const dayStart = new Date(item.timestamp)
          dayStart.setHours(0, 0, 0, 0)
          symbolDataMap[dayStart.getTime()] = item.price
        })

      const data = sortedDates.map((ts) => symbolDataMap[ts] ?? null)

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
      }
    })

    return { labels, datasets }
  }, [financialData, selectedSymbols, hiddenSymbols])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          onClick: undefined,
          
        },
        tooltip: { enabled: true },
        title: { display: true, text: 'Evolución del Precio de Acciones' },
      },
      scales: {
        x: {
          display: true,
          title: { display: true, text: 'Fecha' },
          grid: { display: true },
        },
        y: {
          display: true,
          title: { display: true, text: 'Precio' },
          grid: { display: true },
        },
      },
    }),
    []
  )

  return (
    <div className="w-full" aria-label="Gráfico de líneas que muestra la evolución del precio de las acciones">
      <div className="h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <ChartLegend datasets={chartData.datasets} toggleVisibility={toggleSymbol} />
    </div>
  )
}

export default FinancialChart
