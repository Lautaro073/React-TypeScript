import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/dashboardLayout';
import { fetchFinancialData } from '@/services/api';
import FinancialChart from '@/components/financialChart';
import { FinancialData } from '@/types/financial';
import { DateRange } from 'react-day-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TemporalFilter } from '@/components/temporalFilter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useMinMaxDates } from '@/hooks/useMinMaxDates';
import { useFilteredFinancialData } from '@/hooks/useFilteredFinancialData';
import { Spinner } from '@/components/ui/spinner';
import { FinancialCard } from '@/components/financialCard';
import ErrorBoundary from '@/components/errorBoundary';
import { useRandomCardPrices } from '@/hooks/useRandomCardPrices';

const Dashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  const [dateRange, setDateRange] = useLocalStorage<DateRange | undefined>(
    'dateRange',
    undefined
  );
  const [selectedSymbols] = useLocalStorage<string[]>('selectedSymbols', [
    'AAPL',
    'GOOG',
    'MSFT',
  ]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);


  const cardSymbols = useMemo(() => ['AAPL', 'GOOG', 'MSFT'], []);

  
  const symbolIcons: Record<string, string> = {
    AAPL: '/src/assets/icons/aapl.png',
    GOOG: '/src/assets/icons/goog.png',
    MSFT: '/src/assets/icons/msft.png',
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFinancialData();
        setTimeout(() => {
          setFinancialData(data);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        setFetchError('Error al obtener datos financieros');
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const { minDate, maxDate } = useMinMaxDates(financialData);

  const filteredFinancialData = useFilteredFinancialData(
    financialData,
    dateRange,
    selectedSymbols
  );

  const cardsState = useRandomCardPrices({
    financialData,
    cardSymbols,
    updateInterval: 6000,
  });

  const handleRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setIsFiltering(true)
      setDateRange(range)
      setTimeout(() => {
        setIsFiltering(false)
      }, 300)
    },
    [setDateRange]
  )


  if (isLoading) {
    return (
      <DashboardLayout>
        <div
          className="flex flex-col items-center justify-center h-[50vh]"
          role="status"
          aria-live="polite"
        >
          <Spinner className="mb-2" />
          <span>Cargando datos financieros...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500 mt-10">{fetchError}</div>
      </DashboardLayout>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="mb-4 flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Precios de Acciones en Tiempo Real
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cardsState.map((card) => (
              <FinancialCard
                key={card.symbol}
                symbol={card.symbol}
                currentPrice={card.currentPrice}
                previousPrice={card.previousPrice}
                iconPath={symbolIcons[card.symbol] || '/icons/default.svg'}
              />
            ))}
          </div>
          <TemporalFilter
            onRangeChange={handleRangeChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          Evolución del Precio de Acciones
        </h2>

        {isFiltering && (
          <div
            className="text-center text-sm text-gray-400 mb-2"
            role="status"
            aria-live="polite"
          >
            Filtrando...
          </div>
        )}

        {filteredFinancialData.length === 0 ? (
          <Alert variant="destructive">
            <AlertTitle>No hay datos</AlertTitle>
            <AlertDescription>
              No se encontraron datos para el rango de fechas y acciones
              seleccionados.
            </AlertDescription>
          </Alert>
        ) : (
          <figure>
            <FinancialChart
              financialData={filteredFinancialData}
              selectedSymbols={selectedSymbols}
            />
            <figcaption className="sr-only">
              Gráfico de líneas que muestra la evolución del precio de las
              acciones seleccionadas a lo largo del tiempo. El eje horizontal
              representa las fechas y el eje vertical el precio. Se pueden
              identificar cambios de tendencia con flechas en la leyenda.
            </figcaption>
          </figure>
        )}
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default Dashboard;
